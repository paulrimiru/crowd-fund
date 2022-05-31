import compile from '../compile.server';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import assert from 'assert';

// const assert = require("assert");
const ganache = require("ganache-cli");

const web3 = new Web3(ganache.provider());

let accounts: string[];
let inbox: Contract;

let { interface: intf, bytecode } = compile;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(intf))
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ from: accounts[0], gas: 1000000 });
});

describe("Inbox", () => {
  it("should deploy a contract", async () => {
    assert.ok(inbox.options.address);
  });

  it("should have a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });

  it("should be able to change the message", async () => {
    const initialMessage = await inbox.methods.message().call();
    assert.equal(initialMessage, "Hi there!");
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});
