var express = require('express')
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

console.log("server running")

app.get('/', function(req,res){
    res.send('Hello World')
    
});


app.get('/blockchain', function(req,res){
    res.send('show all of the blockchain')
    
});



app.post('/transaction', function(req,res){
    console.log(req.body);
    res.send('The amount of the transactions is ', req.body.amount )
    
});


app.get('/mine', function(req,res){
    res.send('mine new block')
    
});



app.listen(3000, function(){console.log('listening on port 3000')});