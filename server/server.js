require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

// const mongoose = require('./db/mongoose').mongoose;
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;


app.use(bodyParser.json());

// Routes

// POST /todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        //console.log("Unable to save todo"), 
        res.status(400).send(err);
    });
});

// GET /todos
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


// DELETE
app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id; // the ':id' stands for parameter that a user would enter ex: /todos/123

    // validate the id - if not valid, return 404
    if (!ObjectID.isValid(id)){
        // console.log('ID not valid');
        return res.status(404).send();
    }

    // remove todo by id
    // if todo - send it back to user
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        return res.status(200).send({todo});
        }).catch((e) => {
            res.status(400).send();
        });
});

// PATCH
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //lodash allows us to pick specific values that we want users to be able to update

    // validate the id - if not valid, return 404
    if (!ObjectID.isValid(id)){
        // console.log('ID not valid');
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) { // if it's a boolean and is set to true
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
        }).catch((e) => {
            res.status(404).send();
        })
});


// USERS

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send(user);
        }).catch((err) => {
            //console.log("Unable to create user"), 
            res.status(400).send(err);
        });
});


// runs after 'next' from 'authenticate' - PRIVATE route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    // res.send(body);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
})

// PRIVATE route
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port} \n`);
});

module.exports = {app};

// Need to have mongodb running in the background (at least locally)
// Use 'node server/server.js' to start the web server
// Use Postman to test