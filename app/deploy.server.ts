import Web3 from 'web3';
import compile from './compile.server';

const HDWalletProvider = require('truffle-hdwallet-provider');

const provider = new HDWalletProvider(
  'cram special street explain float fat remember arrest apart merge bind mistake',
  'https://rinkeby.infura.io/v3/9bb265d1134e458d92a4aaf3611179e5'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const contract = await new web3.eth.Contract(JSON.parse(compile.interface))
    .deploy({ data: compile.bytecode, arguments: ["Hi there!"] })
    .send({ gas: 1000000, from: accounts[0] })
  
  console.log(`Contract deployed to ${contract.options.address}`)
}

deploy()