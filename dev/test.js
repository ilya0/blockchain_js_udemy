/// ******Required for all blockchain tests ******
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain()






// ***************Testing section********************


const previousBlockHash = 'randomblockhash'; //randome string that acts as block hash
const currentBlockData = [
    {
        amount:10,
        sender: 'sender1',
        recipient:'recipient1'
    },
    {
        amount:20,
        sender: 'sender2',
        recipient:'recipient2'
    },
    {
        amount:30,
        sender: 'sender3',
        recipient:'recipient3'
    }
]


console.log( bitcoin.proofOfWork(previousBlockHash,currentBlockData) );

console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData, 185727))

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));

// //create a "bitcoin" blockchain instance

// //run create new block method on bitcoin object, push into block
// bitcoin.createNewBlock(2389,'newblock1', 'hash1');

// bitcoin.createNewTransaction(100,'addressSender123', 'addressRecipent123');

// bitcoin.createNewBlock(111,'KJJtestKDJF', 'test');

// // console.log(bitcoin.chain[1]);

