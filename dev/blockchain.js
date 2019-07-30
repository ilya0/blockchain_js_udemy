function Blockchain(){
    this.chain =[];
    this.pendingTransactions = [];

}


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
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

    return newBlock;
}


Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

//create new transaction
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