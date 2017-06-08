//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connecdt to MondoDB server');
    } 
    console.log('Connected to MongoDB server');

    
    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59376145da9c3dec03f144df')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });


     // findOneAndUpdate
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5937622dda9c3dec03f14543')
    }, {
        $set: {
            name: 'Ann',
            location: 'Pincourt'
        },
        $inc: {
            age: 1
        }
    },
    {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});