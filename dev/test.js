/// ******Required for all blockchain tests ******
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain()

const bc1 =
{
    "chain": [
      {
        "index": 1,
        "timestamp": 1581097919434,
        "transactions": [
          
        ],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
      },
      {
        "index": 2,
        "timestamp": 1581098259666,
        "transactions": [
          {
            "amount": 90,
            "sender": "sender1",
            "recipient": "recipient1"
          },
          {
            "amount": 80,
            "sender": "sender1",
            "recipient": "recipient1"
          },
          {
            "amount": 70,
            "sender": "sender1",
            "recipient": "recipient1"
          }
        ],
        "nonce": 187094,
        "hash": "000041533cf7bab44bbfe03a84a007d240202d188bb9131fb7b5a3056abc2d6d",
        "previousBlockHash": "0"
      },
      {
        "index": 3,
        "timestamp": 1581098292804,
        "transactions": [
          
        ],
        "nonce": 327380,
        "hash": "000076397e4ab7c0eda76aff03c080c7ca6ffe8ea4112e04a0587ed1ed1275f9",
        "previousBlockHash": "000041533cf7bab44bbfe03a84a007d240202d188bb9131fb7b5a3056abc2d6d"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "89ef42a049d211ea9071e5a4a2ea301e",
        "transactionId": "6883b2d049d311ea9071e5a4a2ea301e"
      },
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "89ef42a049d211ea9071e5a4a2ea301e",
        "transactionId": "68849d3049d311ea9071e5a4a2ea301e"
      }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [
      
    ]
  }

console.log('Valid', bitcoin.chainIsValid(bc1.chain));

