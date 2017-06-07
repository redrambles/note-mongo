//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connecdt to MondoDB server');
    } 
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(err);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    //  }, (err) => {
    //     console.log(err);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    //  }, (err) => {
    //     console.log(err);
    // });


    // deleteMany
    db.collection('Users').deleteMany({name: 'Ann'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('59376425da9c3dec03f14629')}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log(err);
    });


    //db.close();
});