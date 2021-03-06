const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken'); // JSON web token
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, //removes any leading or trailing white spaces
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    // make sure that we are only returning id & email - not the token and password
    return _.pick(userObject, ['_id', 'email']);
};

// methods = user instance method
// Using 'regular' function because need to use 'this' which doesn't work with arrow functions (does not bind)
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, process.env.JWT_SECRET).toString();

    user.tokens.push({
        access, token
    });
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        // $pull is a mongodb variable that removes an object from an array
        $pull: {
            tokens: {token}
        }
    });
};

// statics = User model method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token, // quotes required when there is a '.' in the value
        'tokens.access' : 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject(); // this will trigger the catch(e) in server.js
        }

        // bcrypt library only works with callbacks - so need a new Promise in order to keep working with promises
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }

            });

        })
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    // returns true if it was modified
    if (user.isModified('password')){
        //user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
               // console.log(hash);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('Users', UserSchema);

module.exports = { User };
