var express = require('express');
var bodyParser = require('body-parser');

// var mongoose = require('./db/mongoose').mongoose;
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');

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
        });
    });

// GET /todos/1234...
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
  
    // Validate id using isValid
    // If id is not valid - send back empty send(400) with message
    if (!ObjectID.isValid(id)){
        // console.log('ID not valid');
        return res.status(404).send();
    }
    // Our id is valid - let's fetch it with findById
    Todo.findById(id).then((todo) => {
        // if todo not found in database - send back 404 with empty body
        if (!todo) {
        return res.status(404).send();
        }
        // if todo - send it back to user
        return res.send({todo});
        // error 404 - send back nothing
        }).catch((e) => {
            res.status(400).send();
        });
});


app.listen('3000', () => {
    console.log('Started on port 3000 \n');
});


module.exports = {app};
