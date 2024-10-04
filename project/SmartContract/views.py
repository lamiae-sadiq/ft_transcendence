#It is recommended that your development environment have the PYTHONWARNINGS=default environment variable set. Some deprecation warnings will not show up without this variable being set.

from django.http import JsonResponse
from web3 import Web3
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()
privateKey = os.getenv('private_key')

# Contract configuration
CONTRACT_ADDRESS = '0xDf7d0d188053C31812C031835869336D8fE0ea5c'
RPC_SEPOLIA = 'https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d'
CHAIN_ID = 11155111

# Load ABI and bytecode
def load_contract_data():
    with open('./SM/abi.json', 'r') as abifile:
        abi_data = json.load(abifile)
    with open('./SM/bytecode.json', 'r') as bytefile:
        bytecode_data = json.load(bytefile)
    return abi_data["abi"], bytecode_data["byteCode"]

abi, byteCode = load_contract_data()

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_SEPOLIA))
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
account = w3.eth.account.from_key(privateKey)
gas_price = w3.eth.gas_price

# Utility function to send a transaction
def send_transaction(func, *args):
    transaction = func(*args).build_transaction({
        'chainId': CHAIN_ID,
        'gasPrice': gas_price,
        'nonce': w3.eth.get_transaction_count(account.address),
    })
    signed_tx = w3.eth.account.sign_transaction(transaction, privateKey)
    hash_tx = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    w3.eth.wait_for_transaction_receipt(hash_tx, timeout=360)

# Endpoint functions
def create_tournament(request):
    send_transaction(contract.functions.createTournament)
    return JsonResponse({'status': "success", "message": "Tournament Created"})

def record_match(request):
    player1 = request.get('player1_name')
    player1_score = request.get('player1_score')
    player2 = request.get('player2_name')
    player2_score = request.get('player2_score')
    tournament_id = request.get('tournament_id')
    
    send_transaction(contract.functions.recordMatch, tournament_id, player1, player2, player1_score, player2_score)
    return JsonResponse({"status": "success", "message": "Match recorded."})

def get_tournament_matches(request):
    tournament_id = request.get('tournament_id')
    matches = contract.functions.getTournamentMatches(tournament_id).call()
    return JsonResponse({"status": "success", "matches": matches})

def get_player_stats(request):
    player_name = request.get('player1_name')
    stats = contract.functions.getPlayerStats(player_name).call()
    return JsonResponse({"status": "success", "stats": stats})

def get_all_matches_played_by_player(request):
    player_name = request.get('player1_name')
    matches = contract.functions.getAllMatchesPlayedByThePlayer(player_name).call()
    return JsonResponse({"status": "success", "matches": matches})

# print(GetAllMatchesPlayedByThePlayer(request))


# print(abi_hardhat)
# print(byteCode_hardhat)

# def SmartContract():
    # print('-------------------------1')
    # w3 = Web3(Web3.HTTPProvider(RPCsepolia))
    # print('-------------------------2') 
    # contract = w3.eth.contract(address=contract_address, abi=abi)
    # print('-------------------------3')
    # result = contract.functions.createTournament().call()
    # print(result)
    # print('-------------------------4')
    # account = w3.eth.account.from_key(privateKey_hardhat)
    # transaction = contract.functions.createTournament().build_transaction({
    #     'chainId': 31337,
    #     'gas': 2000000,
    #     'gasPrice': w3.to_wei('50', 'gwei'),
    #     'nonce': w3.eth.get_transaction_count(account.address),
    # })
    # signed_tx = w3.eth.account.sign_transaction(transaction, privateKey_hardhat)
    # tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    # print('Transaction sent ! hash: ', w3.to_hex(tx_hash))
    # print("-----------------------------5")
    # tran = contract.functions.recordMatch(0, 'ayoub', 'hamid', 20, 10).build_transaction({
    #     'nonce': w3.eth.get_transaction_count(account.address),
    # })
    # signtx = w3.eth.account.sign_transaction(tran,privateKey_hardhat)
    # hash = w3.eth.send_raw_transaction(signtx.raw_transaction)
    # print('Transaction sent ! hash: ', w3.to_hex(hash))
    # print(contract.functions.tournamentCounter().call())
    # print(contract.functions.playerStats('ayoub').call())
    # w3 = Web3(Web3.HTTPProvider(RPCsepolia)) #connected to the sepolia node
    # contract = w3.eth.contract(address=contract_address, abi=abi) #took an instance of my smart contract
    # account = w3.eth.account.from_key(privateKey)
    
    # Set a low gas price for Sepolia
    # gas_price = w3.eth.gas_price
    # gas_estimate = contract.functions.createTournament().estimate_gas({
    #     'from': account.address,
    # })
    # nonce = w3.eth.get_transaction_count(account.address)

    # createTournament = contract.functions.createTournament().build_transaction({
    #     'chainId': 11155111,
    #     'gas': gas_estimate,
    #     'gasPrice': gas_price,
    #     'nonce': w3.eth.get_transaction_count(account.address),
    # })
    # sign_tx = w3.eth.account.sign_transaction(createTournament, privateKey)
    # hash = w3.eth.send_raw_transaction(sign_tx.raw_transaction)
    # tx_receipt = w3.eth.wait_for_transaction_receipt(hash)
    # print('TOURNAMENT CREATED : Transaction sent ! hash: ', w3.to_hex(hash))
    # Get the current nonce
    # nonce += 1
#     recordMatch = contract.functions.recordMatch(0, 'ayoub', 'hamid', 10, 20).build_transaction({
#         'chainId': 11155111,
#         'gasPrice': gas_price,
#         'nonce': nonce,
#     })
#     sign_tx = w3.eth.account.sign_transaction(recordMatch, privateKey)
#     hash = w3.eth.send_raw_transaction(sign_tx.raw_transaction)
#     tx_receipt = w3.eth.wait_for_transaction_receipt(hash, timeout=300)
#     print("MATCH RECORDED : ", w3.to_hex(hash))
#     print("Match played in tournament", contract.functions.getTournamentMatches(0).call())
#     print('Ayoub Stats : ', contract.functions.getPlayerStats('ayoub').call())
#     print('Ayoub Stats : ', contract.functions.getAllMatchesPlayedByThePlayer('ayoub').call())


# SmartContract()


#path('create-tournament/', create_tournament, name='create_tournament'),
   # path('record-match/', record_match, name='record_match'),
  #  path('tournament-matches/', get_tournament_matches, name='tournament_matches'),
   # path('player-stats/', get_player_stats, name='player_stats'),
   # path('player-matches/', get_all_matches_played_by_player, name='player_matches'),