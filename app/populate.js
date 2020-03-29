import Voting from './artifacts/Voting';
import {address} from './config';
import {ethers} from 'ethers';
import "./proposal.css";

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
  container.innerHTML = "";
  proposals.forEach((proposal, id) => {
    container.innerHTML += getHTML(proposal, id);
  });
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

function getHTML({ question, yesCount, noCount }, id) {
  return `
    <div class="proposal">
      <div class="question"> ${question} </div>
      <div class="counts">
        <div class="yes-count"> Yes: ${yesCount} </div>
        <div class="no-count"> No: ${noCount} </div>
      </div>
      <div class="vote-actions">
        <div id="yes-${id}" class="button vote-yes"> Vote Yes </div>
        <div id="no-${id}" class="button vote-no"> Vote No </div>
      </div>
    </div>
  `;
}

populateProposals();
