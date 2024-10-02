#It is recommended that your development environment have the PYTHONWARNINGS=default environment variable set. Some deprecation warnings will not show up without this variable being set.

from web3 import Web3
from dotenv import load_dotenv
import os
import json

load_dotenv()
privateKey = os.getenv('private_key')
with open('./SmartContract/contract_abi.json', 'r') as abifile:
    abi_data = json.load(abifile)
    abi = abi_data["abi"]
with open('./SmartContract/contract_byteCode.json', 'r') as bytefile:
    bytecode_data = json.load(bytefile)
    byteCode = bytecode_data["byteCode"]

RPCsepolia = 'https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d'

with open('./SmartContract/abiHardhat.json', 'r') as abifile:
    abi_data = json.load(abifile)
    abi_hardhat = abi_data["abi"]
with open('./SmartContract/byteCodehardhat.json', 'r') as bytefile:
    bytecode_data = json.load(bytefile)
    byteCode_hardhat = bytecode_data["deployedBytecode"]

privateKey_hardhat = os.getenv('private_key_hardhat')
hardhatRPC = 'http://127.0.0.1:8545/' #should run it first 
contract_address_hardhat = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
print(abi_hardhat)
print(byteCode_hardhat)

def SmartContract():
    print('-------------------------1')
    w3 = Web3(Web3.HTTPProvider(hardhatRPC))
    print('-------------------------2') 
    contract = w3.eth.contract(address=contract_address_hardhat, abi=abi_hardhat)
    print('-------------------------3')
    result = contract.functions.createTournament().call()
    print(result)
    print('-------------------------4')
    account = w3.eth.account.from_key(privateKey_hardhat)
    transaction = contract.functions.createTournament().build_transaction({
        'chainId': 31337,
        'gas': 2000000,
        'gasPrice': w3.to_wei('50', 'gwei'),
        'nonce': w3.eth.get_transaction_count(account.address),
    })
    signed_tx = w3.eth.account.sign_transaction(transaction, privateKey_hardhat)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    print('Transaction sent ! hash: ', w3.to_hex(tx_hash))
    print("-----------------------------5")
    # tran = contract.functions.recordMatch(0, 'ayoub', 'hamid', 20, 10).build_transaction({
    #     'nonce': w3.eth.get_transaction_count(account.address),
    # })
    # signtx = w3.eth.account.sign_transaction(tran,privateKey_hardhat)
    # hash = w3.eth.send_raw_transaction(signtx.raw_transaction)
    # print('Transaction sent ! hash: ', w3.to_hex(hash))
    print(contract.functions.tournamentCounter().call())
    print(contract.functions.playerStats('ayoub').call())
SmartContract()


