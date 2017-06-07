//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
// var user = {name: 'Ann', age: 41};
// var {name} = user; // destructures the user object and extract the name variable
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connecdt to MondoDB server');
    } 
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo.', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users Collection - name, age, location

    // db.collection('Users').insertOne({
    //     name: 'Ann',
    //     age: 41,
    //     location: 'Pincourt'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert User.', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    db.close();
});