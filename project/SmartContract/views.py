#It is recommended that your development environment have the PYTHONWARNINGS=default environment variable set. Some deprecation warnings will not show up without this variable being set.
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from web3 import Web3
from dotenv import load_dotenv
import os
import json

import logging

logger = logging.getLogger('django')

# Load environment variables
load_dotenv()
privateKey = os.getenv('private_key')
# print(privateKey)

# Contract configuration
CONTRACT_ADDRESS = '0x847320669a3e809097cEa3B52a6150C90dA98191'
RPC_SEPOLIA = 'https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d'
CHAIN_ID = 11155111

# Load ABI and bytecode
def load_contract_data():
    with open('/app/SmartContract/SM/abi.json', 'r') as abifile:
        abi_data = json.load(abifile)
    with open('/app/SmartContract/SM/bytecode.json', 'r') as bytefile:
        bytecode_data = json.load(bytefile)
    return abi_data["abi"], bytecode_data["byteCode"]

abi, byteCode = load_contract_data()

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_SEPOLIA))
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
account = w3.eth.account.from_key(privateKey)
gas_price = w3.eth.gas_price

# @csrf_exempt
# def send_transaction(func, *args):
#     try:
#         transaction = func(*args).build_transaction({
#             'chainId': CHAIN_ID,
#             'gasPrice': gas_price,
#             'nonce': w3.eth.get_transaction_count(account.address),
#         })
#         signed_tx = w3.eth.account.sign_transaction(transaction, privateKey)
#         hash_tx = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
#         w3.eth.wait_for_transaction_receipt(hash_tx, timeout=360)

#         # Call the contract function to get the integer result (e.g., tournamentId)
#         if func == contract.functions.createTournament:
#             return func().call()  # Assuming this returns the integer
#     except Exception as e:
#         raise Exception(f"Transaction failed: {str(e)}")  # Rethrow the exception to be caught later

@csrf_exempt
def send_transaction(func, *args):
    try:
        # Get current gas price data
        max_priority_fee = w3.to_wei(2, 'gwei')  # Reasonable tip for miners
        logger.debug("---------------------------------------------------------------")
        # Build the transaction with EIP-1559 parameters
        transaction = func(*args).build_transaction({
            'chainId': CHAIN_ID,
            'nonce': w3.eth.get_transaction_count(account.address),
            'maxFeePerGas': gas_price + max_priority_fee,  # Total max gas fee
            'maxPriorityFeePerGas': max_priority_fee,  # Tip for miners
            'gas': 3000000,  # Estimate or set manually
        })

        # Sign and send the transaction
        signed_tx = w3.eth.account.sign_transaction(transaction, privateKey)
        hash_tx = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        w3.eth.wait_for_transaction_receipt(hash_tx, timeout=360)

        # Optional: Return the result of the contract function if applicable
        if func == contract.functions.createTournament:
            return func().call()  # Assuming this returns the integer
    except Exception as e:
        raise Exception(f"Transaction failed: {str(e)}")  # Rethrow the exception to be caught later


@csrf_exempt
def create_tournament(request):
    if request.method == "POST":
        try:
            # Get the integer result from the transaction
            tournament_id = send_transaction(contract.functions.createTournament)
            return JsonResponse({'status': "success", "tournamentId": tournament_id})
        except Exception as e:
            # Catch and return any errors as JSON
            return JsonResponse({'status': "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})

@csrf_exempt
# @ensure_csrf_cookie
def record_match(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            player1 = data.get('player1_name')
            player1_score = data.get('player1_score')
            player2 = data.get('player2_name')
            player2_score = data.get('player2_score')
            tournament_id = data.get('tournament_id')

            if not (player1 and player2 and player1_score is not None and player2_score is not None and tournament_id):
                return JsonResponse({"status": "error", "message": "All match details must be provided"})

            send_transaction(contract.functions.recordMatch, tournament_id, player1, player2, player1_score, player2_score)
            return JsonResponse({"status": "success", "message": "Match recorded."})
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
