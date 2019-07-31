//intialize the blockchain 
function Blockchain(){
    this.chain =[]; //current chain
    this.pendingTransactions = [];

}

//adding a creanewblock prototype to the blockchain function, creates a new block then clear the pending transactions and push the new block in the chain
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    //newblock object
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
    const newTransaction ={
        amount: amount,
        sender: sender,
        recipient: recipient
    }
    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;
    
};



module.exports = Blockchain;