import { abi, bytecode } from '../compile.server';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import assert from 'assert';

// const assert = require("assert");
const ganache = require("ganache-cli");

const web3 = new Web3(ganache.provider());

let accounts: string[];
let crowdFund: Contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // deploy the contract
  crowdFund = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ["Hi there!", "Test Description", web3.utils.toWei("2")] })
    .send({ from: accounts[0], gas: 1000000 });
});

describe("Inbox", () => {
  it("should deploy a contract", async () => {
    assert.ok(crowdFund.options.address);
  });

  it("should have a default name", async () => {
    const name = await crowdFund.methods.name().call();
    assert.equal(name, "Hi there!");
  });

  it("should have a default description", async () => {
    const description = await crowdFund.methods.description().call();
    assert.equal(description, "Test Description");
  })
  
  it("should have a default target", async () => {
    const target = await crowdFund.methods.target().call();
    assert.equal(web3.utils.fromWei(target), 2);
  })

  it("should have a default amount as 0", async () => {
    const amount = await crowdFund.methods.getAmount().call();
    assert.equal(amount, 0);
  })

  it("should be able to fund the contract and get the amount", async () => {
    const receipt = await web3.eth.sendTransaction({from: accounts[1], to: crowdFund.options.address, value: web3.utils.toWei("1") });
    console.log(receipt.transactionHash);

    const amount = await crowdFund.methods.getAmount().call();
    assert.equal(web3.utils.fromWei(amount), 1);
  })
  
  // it("should be able to remit funds when target is reached", async () => {
  //   const receipt = await web3.eth.sendTransaction({from: accounts[1], to: crowdFund.options.address, value: web3.utils.toWei("2") });
  //   console.log(receipt.transactionHash);

  //   const amount = await crowdFund.methods.getAmount().call();
  //   assert.equal(web3.utils.fromWei(amount), 2);

  //   await crowdFund.methods.remitAmount();
  //   const newAmount = await crowdFund.methods.getAmount().call();
  //   assert.equal(newAmount, 0)
  // })
});
