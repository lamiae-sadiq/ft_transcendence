#It is recommended that your development environment have the PYTHONWARNINGS=default environment variable set. Some deprecation warnings will not show up without this variable being set.
from django.conf import settings

# Define settings in a dictionary
settings.configure(
    DEFAULT_CHARSET='utf-8',
    # Add other settings as needed
)

from django.http import JsonResponse
from web3 import Web3
from dotenv import load_dotenv
import os
import json

load_dotenv()
privateKey = os.getenv('private_key')
print(privateKey)

with open('./SmartContract/contract_abi.json', 'r') as abifile:
    abi_data = json.load(abifile)
    abi = abi_data["abi"]
with open('./SmartContract/contract_byteCode.json', 'r') as bytefile:
    bytecode_data = json.load(bytefile)
    byteCode = bytecode_data["byteCode"]

contract_address = '0xDf7d0d188053C31812C031835869336D8fE0ea5c'
RPCsepolia = 'https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d'


# with open('./SmartContract/abiHardhat.json', 'r') as abifile:
#     abi_data = json.load(abifile)
#     abi_hardhat = abi_data["abi"]
# with open('./SmartContract/byteCodehardhat.json', 'r') as bytefile:
#     bytecode_data = json.load(bytefile)
#     byteCode_hardhat = bytecode_data["deployedBytecode"]

# privateKey_hardhat = os.getenv('private_key_hardhat')
# hardhatRPC = 'http://127.0.0.1:8545/' #should run it first 
# contract_address_hardhat = '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f'

request = {
    'player1_name': 'Ayoub',
    'player2_name': 'Hamid',
    'player1_score': 1,
    'player2_score': 2,
    'tournament_id': 1
}
##################################################################
w3 = Web3(Web3.HTTPProvider(RPCsepolia))
contract = w3.eth.contract(address=contract_address, abi=abi)
account = w3.eth.account.from_key(privateKey)
chainId = 11155111
gas = w3.eth.gas_price
##################################################################

def RecordMatch(request):
    # data = json.loads(request.body)
    player1 = request.get('player1_name')
    player1_score = request.get('player1_score')
    player2 = request.get('player2_name')
    player2_score = request.get('player2_score')
    tournament_id = request.get('tournament_id')
    transaction = contract.functions.recordMatch(tournament_id, player1, player2, player1_score, player2_score).build_transaction({
        'chainId': chainId,
        'gasPrice': gas,
        'nonce': w3.eth.get_transaction_count(account.address),
    })
    sign_tx = w3.eth.account.sign_transaction(transaction, privateKey)
    hash_tx = w3.eth.send_raw_transaction(sign_tx.raw_transaction)
    recipient = w3.eth.wait_for_transaction_receipt(hash_tx, timeout=360)
    return JsonResponse({"status": "success", "message": "Match recorded."})
    
# RecordMatch(request)

def GetTournamentMatches(request):
    tournament_id = request.get('tournament_id')
    transaction = contract.functions.getTournamentMatches(tournament_id).call()
    print(transaction)
    # Prepare the response
    response_data = {
        "status": "success",
        "message": transaction  # Directly use the transaction data
    }
    # print(json.dumps(response_data)) #to print the response
    return JsonResponse(response_data)
    
# print(GetTournamentMatches(request))

def GetPlayerStats(request):
    player_name = request.get('player1_name')
    transaction = contract.functions.getPlayerStats(player_name).call()
    print(transaction)
    # Prepare the response
    response_data = {
        "status": "success",
        "message": transaction  # Directly use the transaction data
    }
    print(json.dumps(response_data)) #to print the response
    return JsonResponse(response_data)
    
# print(GetPlayerStats(request))

def GetAllMatchesPlayedByThePlayer(request):
    player_name = request.get('player1_name')
    transaction = contract.functions.getAllMatchesPlayedByThePlayer(player_name).call()
    print(transaction)
    # Prepare the response
    response_data = {
        "status": "success",
        "message": transaction  # Directly use the transaction data
    }
    print(json.dumps(response_data)) #to print the response
    return JsonResponse(response_data)
    
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
