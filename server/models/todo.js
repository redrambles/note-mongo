var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true, // is set to false by default
        minlength: 1,
        trim: true // removes any leading or trailing white spaces
    },
    completed: {
        type: Boolean,
        default: false // if not entered, will still pass
    },
    completedAt: {
        type: Number,
        default: null // if not entered, will still pass
    }
});

module.exports = { Todo };