import Voting from './artifacts/Voting';
import {address} from './config';
import {ethers} from 'ethers';
import "./index.css";
import "./populate.js";

const provider = new ethers.providers.Web3Provider(web3.currentProvider);

async function newProposal() {
  const question = document.getElementById("question").value;
  await ethereum.enable();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, Voting.abi, signer);
  await contract.newProposal(question);
}

document.getElementById("deploy").addEventListener("click", newProposal);
