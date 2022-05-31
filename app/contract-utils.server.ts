import Web3 from "web3";
import type { Contract } from 'web3-eth-contract';
import { abi } from "./compile.server";

const HDWalletProvider = require("truffle-hdwallet-provider");

const { MNEMONIC, INFURA_LINK } = process.env;

const provider = new HDWalletProvider(MNEMONIC, INFURA_LINK);
const web3 = new Web3(provider);

export const getProjectContract = async (address: string): Promise<Contract> => {
  const project = await new web3.eth.Contract(abi, address);
  return project;
}