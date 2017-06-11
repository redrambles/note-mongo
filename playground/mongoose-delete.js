const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove()
Todo.findOneAndRemove({'completed: false'}).then((todo) => {
        console.log('Deleting: \n', todo);
});

// Todo.findByIdAndRemove()
Todo.findByIdAndRemove('593c941c31a79d26d4d1f2f7').then((todo) => {
    console.log('Deleting: \n', todo);
});