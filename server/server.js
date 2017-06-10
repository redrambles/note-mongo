var express = require('express');
var bodyParser = require('body-parser');

// var mongoose = require('./db/mongoose').mongoose;
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
app.use(bodyParser.json());

// Routes
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        console.log("Unable to save todo"), 
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); 
        }, (e) => {
            res.status(400).send(e);
        })
    });


app.listen('3000', () => {
    console.log('Started on port 3000');
});


module.exports = {app};
