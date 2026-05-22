const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minLength: [2, 'Name requires atleast 2 characters.']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already registered'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide correct email.'
        ]
    },
    password: {
        type: String,
        require: [true, 'Please enter password'],
        minLength: [6, 'Password must be atleast 6 characters.']
    },
    role: {
        type: String,
        enum: {
            values: ['client', 'admin'],
            message: '{VALUE} is not supported'
        },
        default: 'client'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);