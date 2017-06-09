var mongoose = require('mongoose');

var User = mongoose.model('Users', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //removes any leading or trailing white spaces
    }
});

module.exports = { User };
