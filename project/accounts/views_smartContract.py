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
    
print(abi)
print(byteCode)

def SmartContract():
    w3 = Web3(Web3.HTTPProvider('https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d'))
    contract = w3.eth.contract(abi=abi, bytecode=byteCode)
    print(contract)
    # to be added in the .env

SmartContract()