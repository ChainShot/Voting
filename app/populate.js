import Voting from './artifacts/Voting';
import buildProposal from './proposal';
import {address} from './config';
import {ethers} from 'ethers';

const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const contract = new ethers.Contract(address, Voting.abi, provider);

const proposals = [];
async function populateProposals() {
  const count = await contract.proposalCount();
  for(let i = 0; i < count.toNumber(); i++) {
    proposals.push(await contract.proposals(i));
  }
  renderProposals();
  listenForProposals();
}

async function listenForProposals() {
  const contract = new ethers.Contract(address, Voting.abi, provider);
  contract.on("ProposalCreated", async (id) => {
    if(!proposals[id]) {
      const proposal = await contract.proposals(id);
      proposals.push(proposal);
      renderProposals();
    }
  });
  contract.on("VoteCast", async (id) => {
    const proposal = await contract.proposals(id);
    proposals[id] = proposal;
    renderProposals();
  });
}

function renderProposals() {
  const container = document.getElementById("container");
  container.innerHTML = proposals.map(buildProposal).join("");
  proposals.forEach((proposal, id) => {
    addListeners(id);
  });
}

function addListeners(id) {
  document.getElementById(`yes-${id}`).addEventListener("click", async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).castVote(id, true);
  });
  document.getElementById(`no-${id}`).addEventListener("click", async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).castVote(id, false);
  });
}

populateProposals();
