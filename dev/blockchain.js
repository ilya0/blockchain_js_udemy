const sha256 = require('sha256'); //chain encryption
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v1");


function Blockchain(){//intialize the  whole blockchain 
    this.chain =[]; //current chain
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.createNewBlock(100,'0','0'); // genesis block
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
        recipient: recipient,
        transactionId : uuid().split("-").join('')
    };

return newTransaction
    
};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
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


Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain = true;

    for( var i = 1; i < blockchain.length; i++ ){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1] 

        const blockHash = this.hashBlock(prevBlock['hash'], 
        { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce'] )
        
        if(blockHash.substring(0,4) !== '0000') validChain = false;

        if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
        console.log('previousBlockHash =>', prevBlock['hash']);
console.log('currentBlockHash =>', currentBlock['hash']);

    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;



console.log(genesisBlock,
            correctNonce,
            correctPreviousBlockHash,
            correctHash,
            correctTransactions);

console.log(
    genesisBlock,
    "----------------",
    genesisBlock['nonce'],
    genesisBlock['previousBlockHash'],
    genesisBlock['hash'],
    genesisBlock['transactions'].length);


    

/// all values need to be true, if not validChain should be false
    if(!correctNonce || 
       !correctPreviousBlockHash || 
       !correctHash || 
       !correctTransactions ) validChain = false;

    return validChain;
}

Blockchain.prototype.getBlock = function(blockHash){

    let correctBlock = null;
    this.chain.forEach(block =>{
        if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


Blockchain.prototype.getAddressData = function(address){
    const addressTransactions = [];

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {

            if(transaction.sender == address || transaction.recipient == address){
                    addressTransactions.push(transaction);
            }
        });
    });

    let balance = 0;

    addressTransactions.forEach(transaction =>{
        if(transaction.recipient === address) balance += transaction.amount;
        else if (transaction.sender === address ) balance -= transaction.amount;
    });

    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    };

};

module.exports = Blockchain;