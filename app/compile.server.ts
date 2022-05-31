const path = require('path');
const fs = require('fs');
const solc = require('solc');

const crowdFundPath = path.resolve(__dirname, '../contracts', 'CrowdFund.sol');
const source = fs.readFileSync(crowdFundPath, 'utf8');

let contractFile = "CrowdFund.sol";
const input = {
  language: "Solidity",
  sources: {
    [contractFile]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
let contract = "CrowdFunding";

const abi = output.contracts[contractFile][contract].abi;
const bytecode = output.contracts[contractFile][contract].evm.bytecode.object;

export { abi, bytecode };
