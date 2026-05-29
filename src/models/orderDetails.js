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
    shippingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Shipping',
        required: [true, 'Product must have a shipping option.']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    productSnapshot: {
        name: String,
        priceCents: Number
    },
    shippingSnapshot: {
        name: String,
        deliveryDays: String,
        priceCents: Number
    }
});

module.exports = mongoose.model('OrderDetails', OrderDetailsSchema);