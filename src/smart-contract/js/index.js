import { abi, contractAddress } from "./constants.js";
// import Web3 from 'web3';

let connectButton = document.getElementById('btn');
let createTournament = document.getElementById('createTournament');
let register = document.getElementById('register');

const provider = "https://sepolia.infura.io/v3/6483579a38ee4626b9a67d15ca7fef2d";
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);
const contract = new web3.eth.Contract(abi, contractAddress);

let accounts;

connectButton.onclick = connect
createTournament.onclick = createTournaments
register.onclick = registering

async function createTournaments() {
  let creationTx = await contract.methods.createTournament()
  ethereum.request({ method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: contractAddress,
          data: creationTx.encodeABI(),
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error(error));
}

async function registering() {
  let creationTx = await contract.methods.registerForTournament(accounts[0])
  ethereum.request({ method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: contractAddress,
          data: creationTx.encodeABI(),
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error(error));
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
}

// kaayna khdma awlidi