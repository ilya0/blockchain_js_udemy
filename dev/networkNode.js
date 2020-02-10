var express = require('express')
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); 
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
   const newTransaction = req.body;
   const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
   res.json({ note: `Transactions will be added in block ${blockIndex}` })

});

//**broadcast transactions to all the nodes */
app.post('/transaction/broadcast', function(req,res){
   
    const newTransaction = bitcoin.createNewTransaction(req.body.amount,req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);
    console.log("newTransaction is", newTransaction);
    const requestPromises = []; // promise array to send all the transactiosn to nodes
    console.log("transaction broadcast hit")
    console.log("bitcoin.networknodes ", bitcoin.networkNodes)


    //broad cast transaction to all the nodes 
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
        console.log("for each in trans broad hit");
        console.log("networknode url is ", networkNodeUrl);
        

        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
      
        requestPromises.push(rp(requestOptions));
    
    });

    Promise.all(requestPromises).then(data => {
        res.json({note: 'transactions created and broadcast confirmed'});
    });
});


app.post('/receive-new-block', function(req,res){
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    //check for correct has and next index
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 == newBlock['index'];

    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note:"New block is reived and accepted",
            newBlock: newBlock
        });
    }else{

        res.json({
            note: " New block rejected",
            newBlock: newBlock
        });
    }
    
});


//  ** mining a transaction **
app.get('/mine', function(req,res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = { transactions: bitcoin.pendingTransactions, index: lastBlock['index'] + 1 };
    const requestPromises = [];
    const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);


    bitcoin.networkNodes.forEach(networkNodeUrl =>{

        const requestOptions = {
            uri:networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock},
            json: true
        };

    requestPromises.push(rp(requestOptions));
    });


    Promise.all(requestPromises)
    
    .then(data =>{

        const requestOptions = {
            uri:bitcoin.currentNodeUrl +'/transaction/broadcast',
            method: 'POST',
            body:{
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
             json: true
        };
         return rp(requestOptions);
    })


    .then(data => {
        res.json({
            note: "New Block mined & broadcast successfully",
            block: newBlock
        });
    })
    
});


// register a node and broadcast it on the network
app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl; // this is the new node url incoming
    console.log("new node Url", newNodeUrl)
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
           uri: newNodeUrl + '/register-nodes-bulk',
           method: 'POST',
           body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
           json: true
       };

       return rp(bulkRegisterOptions);
    })
    .then(data =>{
        res.json({note:"registered sucessesfully"});
    });

});


// register a node with another node
app.post('/register-node', function(req,res){

const newNodeUrl = req.body.newNodeUrl; //get node url from the body
console.log("new node url is ", newNodeUrl);
console.log("nodes are ", bitcoin.networkNodes);
const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1; // if -1 then node is not already present true=present false=needs to be pushed into 
const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl; //evaluate  expression  true if current is not the new node url


/// if its not present and its not the same url as the one we are on, then add to new networkNodes array
 if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl)
 res.json({ note: ' New node registered successfully with node. '})
});


//take the allneworknodes list and add nodes on there
app.post('/register-nodes-bulk',function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;

    //register each network url
    allNetworkNodes.forEach(networkNodeUrl =>{
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });

    res.json({note: 'Bulk Reg successful.'});

});


//goes through and finds the longest blockchain
app.get('/consensus', function(req,res){
    const requestPromises =[];

    bitcoin.networkNodes.forEach(networkNodeUrl => {

    const requestOptions = {
        uri: networkNodeUrl + '/blockchain',
        method: "GET",
        json: true
    };

    requestPromises.push(rp(requestOptions));

Promise.all(requestPromises)
    .then(blockchains =>{
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain =>{
            if(blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }

        });

        if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
            res.json({
                note: 'Current chain has not be replaced.',
                chain: bitcoin.chain
            });
        } else if( newLongestChain && bitcoin.chainIsValid(newLongestChain)){
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransactions = newPendingTransactions
            res.json({
                note: ' This chain has been replaced',
                chain : bitcoin.chain
            });
        }
    })
    });
});



app.get('/block/:blockHash', function(req,res){  //localhost:3001/block/asdfasf1234
    console.log("blockhash is", req.params);

    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);

    res.json({
        block: correctBlock
    });
});


app.get('/transaction/:transactionId', function(req,res){
    console.log("transaction id is", req.params.transactionId);
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);



    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('/address/:address', function (req,res){
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);

    res.json({
        addressData: addressData
    })

});


app.get('/block-explorer', function(req,res){
    console.log("block explorer link hit");
    res.sendFile('./block-explorer/index.html', { root: __dirname });
    
});


app.listen(port, function(){
    console.log(`listening on port ${port}....`)
});