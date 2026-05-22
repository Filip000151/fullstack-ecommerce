const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product must have a name.']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price.']
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);