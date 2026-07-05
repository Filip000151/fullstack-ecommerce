const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    guestId: {
        type: String,
        required: function(){
            return !this.user;
        },
        default: null
    },
    guestEmail: {
        type: String,
        required: function(){
            return !this.user;
        },
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide correct email.'
        ]
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Address is mandatory.']
    },
    shippingSnapshot: {
        name: String,
        deliveryDays: String,
        priceCents: Number
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    totalPriceCents: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    items: [{
        productSnapshot: {
            name: String,
            priceCents: Number,
            coverImage: String
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }]
},{
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);