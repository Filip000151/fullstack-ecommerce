const mongoose = require('mongoose');

const CartDetailsSchema = mongoose.Schema({
    cartId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart',
        required: [true, 'Must belong to a cart.']
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product must be present inside a cart.']
    },
    quantity: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('CartDetails', CartDetailsSchema);