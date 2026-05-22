const mongoose = require('mongoose');

const CartDetailsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Must belong to a user.']
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product must be present inside a cart.']
    },
    shippingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Shipping',
        required: [true, 'Product must have a shipping option']
    },
    quantity: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('CartDetails', CartDetailsSchema);