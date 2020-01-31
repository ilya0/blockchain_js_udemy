var express = require('express')
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); //importing blockchain data structure constructor function
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require("request-promise");
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

    const newNodeUrl = req.body.newNodeUrl; // this is the new node url incoming

    //if the bitcoin url doesnt exist then push it into the array
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1){
        bitcoin.networkNodes.push(newNodeUrl)
    } 



    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl =>{

        // 'register-node'
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        };
        regNodesPromises.push(rp(requestOptions));

    });
    Promise.all(regNodesPromises)
    .then(data =>{
       const bulkRegisterOptions = {
           url: newNodeUrl + '/register-nodes-bulk',
           method: 'POST',
           body:{ allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentnode.url]},
           json: true
       };
       return rp(bulkRegisterOptions);
    })
    .then(data =>{
        res.json({note:"registered sucessesfully"});
    })

});

// register a node with the network
app.post('/register-node', function(req,res){

const newNodeUrl = req.body.newNodeUrl; //get node url from the body
console.log("new node url is ", newNodeUrl);
console.log("nodes are ", bitcoin.networkNodes);
console.log("indexof", indexOf(newNodeUrl))
const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1; // if -1 then node is not already present true=present false=needs to be pushed into 
const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl; //evaluate  expression  true if current is not the new node url


/// if its not present and its not the same url as the one we are on, then add to new networkNodes array

 if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl)
 res.json({ note: ' New node registered successfully with node. '})
});

//register nodes all at once
app.post('/register-nodes-bulk',function(req,res){

});


app.listen(port, function(){
    console.log(`listening on port ${port}....`)
});