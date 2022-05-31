import { abi, bytecode } from '../compile.server';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import assert from 'assert';

// const assert = require("assert");
const ganache = require("ganache-cli");

const web3 = new Web3(ganache.provider());

let accounts: string[];
let inbox: Contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ["Hi there!", "Test Description", 2] })
    .send({ from: accounts[0], gas: 1000000 });
});

describe("Inbox", () => {
  it("should deploy a contract", async () => {
    assert.ok(inbox.options.address);
  });

  it("should have a default name", async () => {
    const name = await inbox.methods.name().call();
    assert.equal(name, "Hi there!");
  });
});
