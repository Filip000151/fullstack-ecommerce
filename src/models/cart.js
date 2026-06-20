const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product must be present inside a cart.']
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalItems: {
        type: Number,
        default: 0
    }
});

CartSchema.index({'items.productId': 1});

module.exports = mongoose.model('Cart', CartSchema);