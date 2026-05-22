const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user.']
    },
    totalPrice: {
        type: Number
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);