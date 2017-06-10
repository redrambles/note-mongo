const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = "593c204e0e9b043573c0378411";

// if (!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
//     }).then((todos) => {
//         console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
//     }).then((todo) => {
//         if (!todo) {
//         return console.log('ID not found');
//     }
//         console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
//     }
//         console.log('Todo By Id', todo);
//     }).catch((e) => {
//         console.log(e);
// });

// Users

var userID = "593af0c6be20d72e2563f79e";

if (!ObjectID.isValid(userID)){
    console.log('User ID not valid'); // If you return this, it won't get to the catch - the code will end here
}

User.findById(userID).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
        console.log('User By Id', user);
    }).catch((e) => {
        console.log(e);
});