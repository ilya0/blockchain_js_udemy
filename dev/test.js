//require the blockchain script
const Blockchain = require('./blockchain');

//create a "bitcoin" blockchain instance
const bitcoin = new Blockchain()
//run create new block method on bitcoin object, push into block
bitcoin.createNewBlock(2389,'KJJKDJF', 'DSFSDFSDF');

bitcoin.createNewTransaction(100,'addressSender123', 'addressRecipent123');

bitcoin.createNewBlock(111,'KJJtestKDJF', 'test');


console.log(bitcoin.chain[1]);

