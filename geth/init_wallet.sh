#!/bin/sh
echo "Initializing wallet..."

geth --datadir /root/.ethereum init /root/genesis.json

echo "-------------------------------------------------------------"

NEW_ACCOUNT="0xC7295920C7887a930db755e81adE4F9Dd49864F6"
GETH_URL="http://gethnode:8545"

echo "Address1: $NEW_ACCOUNT"

geth attach $GETH_URL <<EOF
eth.getBalance("$NEW_ACCOUNT")
eth.sendTransaction({from: eth.accounts[0], to: '$NEW_ACCOUNT', value: web3.toWei(50, 'ether')})
eth.getBalance("$NEW_ACCOUNT")
EOF



echo "Wallet funded with 50 ETH"

tail -f /dev/null
