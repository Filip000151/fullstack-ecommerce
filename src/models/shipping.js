const mongoose = require('mongoose');
const Cart = require('./cart');
const {BadRequestError} = require('../errors');

const ShippingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shipping option must have a name.'],
        unique: true
    },
    deliveryDays: {
        type: Number,
        required: [true, 'Shipping option must have delivery days defined.']
    },
    priceCents: {
        type: Number,
        required: [true, 'Shipping option must have a price.']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipping', ShippingSchema);