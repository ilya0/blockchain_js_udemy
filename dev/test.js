/// ******Required for all blockchain tests ******
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain()

const bc1 =
{
    "chain": [
      {
        "index": 1,
        "timestamp": 1581097906830,
        "transactions": [
          
        ],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
      }
    ],
    "pendingTransactions": [
      
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [
      
    ]
  }

console.log('Valid', bitcoin.chainIsValid(bc1.chain));

