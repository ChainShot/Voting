const env = require("@nomiclabs/buidler");
const fs = require('fs');

async function main() {
  await env.run("compile");

  const Voting = env.artifacts.require("Voting");
  const accounts = await ethereum.send("eth_accounts");
  const voting = await Voting.new(accounts);

  const config = { address: voting.address }
  fs.writeFileSync("./app/config.json", JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
