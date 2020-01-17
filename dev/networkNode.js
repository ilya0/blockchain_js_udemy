var express = require('express')
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); //importing blockchain data structure constructor function
const uuid = require('uuid/v1');

const port = process.argv[2];

const nodeAddress = uuid().split("-").join('');

const bitcoin = new Blockchain(); // new blockchain instance

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
console.log("server running")



//** home test */
app.get('/', function(req,res){
    res.send('Hello World')
});


// ** get the whole blockchain **
app.get('/blockchain', function(req,res){
    res.send(bitcoin)
});


// ** add a transactions **
app.post('/transaction', function(req,res){
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender)
    res.json({note:`Transaction will be added ${blockIndex}.`})
    console.log(req.body);
    //res.send('The amount of the transactions is ' ${req.body.amount} )
});


//  ** mining a transaction **
app.get('/mine', function(req,res){
    //get the last block
    const lastBlock = bitcoin.getLastBlock();
    //console.log("Last block is"+lastblock);
    const previousBlockHash = lastBlock['hash'];
    //console.log("Previous block hash is"+previousBlockHash);
        const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);

    const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  // reward miners for transaction
    bitcoin.createNewTransaction(12.5,"mineraddress", nodeAddress);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
    
});


// register a node and broadcast it on the network
app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1){
        bitcoin.networkNodes.push(newNodeUrl)
    } 
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
        // 'regiser-node'
        
    })

});

// register a node with the network
app.post('/register-node', function(req,res){

});

//register nodes all at once
app.post('/egister-nodes-bulk',function(req,res){

});


app.listen(port, function(){
    console.log(`listening on port ${port}....`)
});