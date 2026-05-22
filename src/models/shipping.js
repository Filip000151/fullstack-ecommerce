const mongoose = require('mongoose');

const ShippingSchema = mongoose.Schema({
    deliveryDays: {
        type: Number,
        required: [true, 'Shipping option must have delivery days defined.']
    },
    price: {
        type: Number,
        required: [true, 'Shipping option must have a price.']
    }
});

module.exports = mongoose.model('Shipping', ShippingSchema);