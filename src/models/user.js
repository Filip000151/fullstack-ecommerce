const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cart = require('./cart');
const orderService = require('../services/orderService');

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

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    await Cart.create({userId: this._id, items: []});
    await orderService.linkGuestOrdersToUser(this.email, this._id);
});

UserSchema.methods.createAccessToken = function(){
    return jwt.sign(
        {userId: this._id, role: this.role, name: this.name}, 
        process.env.JWT_ACCESS_SECRET, 
        {expiresIn: process.env.JWT_ACCESS_LIFETIME}
    );
};

UserSchema.methods.verifyPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);