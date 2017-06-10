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

app.listen('3000', () => {
    console.log('Started on port 3000');
});




// var newTodo = new Todo({
//     text: "Cook dinner"
// });

// newTodo.save().then((doc) => {
//     console.log("Saved todo", doc)
// }, (err) => {
//     console.log("Unable to save todo")
// });

// var newTodo2 = new Todo({
//     text: "Walk the dog",
//     completed: true,
//     completedAt: 35550
// });

// newTodo2.save().then((doc) => {
//     console.log("Saved todo", (JSON.stringify(doc, undefined, 2)))
// }, (err) => {
//     console.log("Unable to save todo")
// });
