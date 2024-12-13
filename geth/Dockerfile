FROM ethereum/client-go:stable

RUN apk update && apk add curl

COPY . /root

RUN chmod +x /root/init_wallet.sh

EXPOSE 8545

ENTRYPOINT ["/bin/sh", "-c", "geth --dev --http --http.addr 0.0.0.0 --http.port 8545 --http.api web3,eth,net,admin,debug,miner --http.corsdomain '*' --allow-insecure-unlock --http.vhosts '*' & sleep 5 && ./root/init_wallet.sh"]