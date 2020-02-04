const sha256 = require('sha256'); //chain encryption
const currentNodeUrl = process.argv[3];


function Blockchain(){//intialize the  whole blockchain 
    this.chain =[]; //current chain
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.createNewBlock(100,'genesis','genesis'); // genesis block
    this.networkNodes = []

}

//adding a  prototype to the blockchain function, creates a new block then clear the pending transactions and push the new block in the chain
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    //new block object
    const newBlock = {
        index: this.chain.length +1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // come from proof of work that the block was created with a work algorythm any number 
        hash: hash, // data from new block
        previousBlockHash: previousBlockHash

    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    //return new block object
    return newBlock;
}


//attach getlastblock prototype function
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

//create new transaction object, then push to pending transactions
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    //push new transaction into pendingtransactions que
    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;
    
};


//sha256 hashing function - confirms the validity of the hash
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
};


// a proof of work is - creating the nonce and finding the correct block hash 
Blockchain.prototype.proofOfWork = function(previousBlockHash,currentBlockData){
let nonce = 0;
let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
while (hash.substring(0,4) !== '0000'){
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    console.log(hash);
}
return nonce;

};

module.exports = Blockchain;