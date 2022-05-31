import Web3 from "web3";
import { abi, bytecode } from "./compile.server";

const HDWalletProvider = require("truffle-hdwallet-provider");

const { MNEMONIC, INFURA_LINK } = process.env;

const provider = new HDWalletProvider(MNEMONIC, INFURA_LINK);

const web3 = new Web3(provider);

interface DeployArgs {
  account: string;
  name: string;
  description: string;
  target: number;
}

const deploy = async ({ account, name, description, target }: DeployArgs) => {
  console.log("Attempting to deploy from account", account);

  const contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [name, description, target] })
    .send({ gas: 1000000, from: account });

  console.log(`Contract deployed to ${contract.options.address}`);

  return contract.options.address;
};

export default deploy;
