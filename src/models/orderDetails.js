const mongoose = require('mongoose');

const OrderDetailsSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Must belong to an order.']
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product must belong to an order.']
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: [true, 'Product must have price.']
    }
});

module.exports = mongoose.model('OrderDetails', OrderDetailsSchema);