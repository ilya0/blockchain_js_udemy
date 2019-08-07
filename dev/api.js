var express = require('express')
var app = express();

console.log("server running")

app.get('/', function(req,res){
    res.send('Hello World')
    
});


app.get('/blockchain', function(req,res){
    res.send('show all of the blockchain')
    
});



app.post('/transaction', function(req,res){
    res.send('post transactions')
    
});


app.get('/mine', function(req,res){
    res.send('mine new block')
    
});



app.listen(3000, function(){console.log('listening on port 3000')});