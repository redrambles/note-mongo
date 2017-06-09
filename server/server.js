// var mongoose = require('./db/mongoose').mongoose;
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');



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

var user = new User({
    email: " ann@ann.com"
});

user.save().then((doc) => {
    console.log("Saved User", (JSON.stringify(doc, undefined, 2)))
}, (err) => {
    console.log("Unable to save user", err)
});
