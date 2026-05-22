const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Cart must belong to a user.']
    }
});