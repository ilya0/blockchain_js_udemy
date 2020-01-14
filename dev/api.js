var express = require('express')
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); //importing blockchain data structure constructor function
const uuid = require('uuid/v1');
const nodeAddress = uuid().split("-").join('');

const bitcoin = new Blockchain(); // new blockchain instance

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

console.log("server running")

app.get('/', function(req,res){
    res.send('Hello World')
    
});


app.get('/blockchain', function(req,res){
    res.send(bitcoin)
    
});



app.post('/transaction', function(req,res){
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender)
    res.json({note:`Transaction will be added ${blockIndex}.`})
    console.log(req.body);
    //res.send('The amount of the transactions is ' ${req.body.amount} )
    
});


app.get('/mine', function(req,res){
    const lastBlock = bitcoin.getLastBlock();

    const previousBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);

    const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

    bitcoin.createNewTransaction(12.5,"mineraddress", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, currentBlockData);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
    
});



app.listen(3000, function(){
    console.log('listening on port 3000')
});