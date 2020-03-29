const Voting = artifacts.require('Voting');
const { BN } = web3.utils;
contract('Voting', ([owner, member1, member2, nonmember]) => {
    let contract;
    before(async () => {
        contract = await Voting.new([member1, member2]);
    });

    describe('creating a new proposal from a nonmember', () => {
        it('should revert', async () => {
            let ex;
            try {
                await contract.newProposal("Should we donate to my address?", { from: nonmember });
            }
            catch(_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
        });
    });

    describe('creating a proposal from a member', () => {
        let tx;
        before(async () => {
            tx = await contract.newProposal("Should we donate to charity?", { from: member1 });
        });

        it('should emit an `ProposalCreated` event', () => {
            const event = tx.logs.find(x => x.event === "ProposalCreated");
            assert(event, "Event not found!");
        });

        describe('casting a vote as a nonmember', () => {
            it('should revert', async () => {
                let ex;
                try {
                    await contract.castVote(0, true, { from: nonmember });
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex, "Attempted to create new proposal from a nonmember. Expected this transaction to revert!");
            });
        });

        describe('casting a vote as the owner', () => {
            let tx;
            before(async () => {
                tx = await contract.castVote(0, false, { from: owner });
            });

            it('should emit an `VoteCast` event', () => {
                const event = tx.logs.find(x => x.event === "VoteCast");
                assert(event, "Event not found!");
            });
        });

        describe('casting a vote as the member', () => {
            let tx;
            before(async () => {
                tx = await contract.castVote(0, true, { from: member2 });
            });

            it('should emit an `VoteCast` event', () => {
                const event = tx.logs.find(x => x.event === "VoteCast");
                assert(event, "Event not found!");
            });
        });
    });
});
