#It is recommended that your development environment have the PYTHONWARNINGS=default environment variable set. Some deprecation warnings will not show up without this variable being set.
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from web3 import Web3
import os
import json
import time
from eth_account import Account
from threading import Lock

import logging

nonce_lock = Lock()

WEB3_PROVIDER_URL = "http://gethnode:8545/"
web3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))

if web3.is_connected():
    print("Connected to Ethereum node")

else:
    print("Failed to connect")

def load_contract_data():
    with open('/app/SmartContract/SM/abi.json', 'r') as abifile:
        abi_data = json.load(abifile)
    with open('/app/SmartContract/SM/bytecode.json', 'r') as bytefile:
        bytecode_data = json.load(bytefile)
    return abi_data["abi"], bytecode_data["byteCode"]

abi, byteCode = load_contract_data()
private_key = "3dd77477bcd17e27e8926d4abcca30d7642e21caec18ec9b4a381dd108767ee0"
account = Account.from_key(private_key)
CHAIN_ID = 1337
global_nonce = web3.eth.get_transaction_count(account.address, 'latest')
contract_instance = web3.eth.contract(abi=abi, bytecode=byteCode)
transaction = contract_instance.constructor().build_transaction({
    'from': account.address,
    'gas': 4700000,
    'gasPrice': web3.to_wei('20', 'gwei'),
    'nonce': global_nonce,
})
signed_txn = web3.eth.account.sign_transaction(transaction, private_key)
txn_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
contract = web3.eth.contract(address=txn_receipt.contractAddress, abi=abi)
print("Smart contract address : ", contract.address)
gas_price = web3.eth.gas_price

@csrf_exempt
def send_transaction(func, *args):
    global global_nonce
    try:
        max_priority_fee = web3.to_wei(20, 'gwei')
        with nonce_lock:
            current_nonce = global_nonce + 1
            global_nonce += 1

        transaction = func(*args).build_transaction({
            'chainId': CHAIN_ID,
            'nonce': current_nonce,
            'maxFeePerGas': gas_price * 2 + max_priority_fee,
            'maxPriorityFeePerGas': max_priority_fee,
            'gas': 5000000,
        })

        signed_tx = web3.eth.account.sign_transaction(transaction, private_key)
        hash_tx = web3.eth.send_raw_transaction(signed_tx.raw_transaction)

        receipt = None
        while not receipt:
            try:
                receipt = web3.eth.get_transaction_receipt(hash_tx)
            except:
                pass
            time.sleep(2)
        if receipt['status'] == 1:
            print(f"Transaction successful. Block number: {receipt['blockNumber']}")
        else:
            print(f"Transaction failed. Receipt: {receipt}")
            return None
        
        if func == contract.functions.createTournament:
            try:
                event_filter = contract.events.tournamentCreated.create_filter(from_block=receipt['blockNumber'])
                logs = event_filter.get_all_entries()
                
                if logs:
                    tournament_id = logs[0]['args']['tournamentId']
                    return tournament_id
                else:
                    print("No event found for TournamentCreated")
                    return None
            except Exception as e:
                print(f"Error while fetching logs: {e}")
                return None
        else:
            return 1
    except Exception as e:
        raise Exception(f"Transaction failed: {str(e)}")

@csrf_exempt
def create_tournament(request):
    if request.method == "POST":
        try:
            tournament_id = send_transaction(contract.functions.createTournament)
            return JsonResponse({'status': "success", "tournamentId": tournament_id})
        except Exception as e:
            return JsonResponse({'status': "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})

@csrf_exempt
def record_match(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            player1 = data.get('player1_name')
            player1_score = data.get('player1_score')
            player2 = data.get('player2_name')
            player2_score = data.get('player2_score')
            tournament_id = data.get('tournament_id')

            if not (player1 and player2 and player1_score is not None and player2_score is not None and tournament_id is not None):
                return JsonResponse({"status": "error", "message": "All match details must be provided"})

            value = send_transaction(contract.functions.recordMatch, tournament_id, player1, player2, player1_score, player2_score)
            if value:
                return JsonResponse({"status": "success", "message": "Match recorded."})
            else:
                return JsonResponse({"status": "error", "message": "You can only record 3 Matches per tournament buddy !"})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})

@csrf_exempt
@ensure_csrf_cookie
def get_tournament_matches(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            tournament_id = data.get('tournament_id')

            if not tournament_id:
                return JsonResponse({"status": "error", "message": "Tournament ID is required"})

            matches = contract.functions.getTournamentMatches(tournament_id).call()
            return JsonResponse({"status": "success", "matches": matches})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
         return JsonResponse({"status": "error", "message": "Invalid request method"})

@csrf_exempt
@ensure_csrf_cookie
def get_player_stats(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            player_name = data.get("player_name")

            if not player_name:
                return JsonResponse({"status": "error", "message": "Player name not provided"})

            stats = contract.functions.getPlayerStats(player_name).call()
            return JsonResponse({"status": "success", "stats": stats})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})

@csrf_exempt
@ensure_csrf_cookie
def get_all_matches_played_by_player(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            player_name = data.get('player_name')

            if not player_name:
                return JsonResponse({"status": "error", "message": "Player name not provided"})

            matches = contract.functions.getAllMatchesPlayedByThePlayer(player_name).call()
            return JsonResponse({"status": "success", "matches": matches})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON format"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})