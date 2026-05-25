const mongoose = require('mongoose');

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
    price: {
        type: Number,
        required: [true, 'Shipping option must have a price.']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipping', ShippingSchema);