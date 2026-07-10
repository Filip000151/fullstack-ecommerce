const mongoose = require('mongoose');
const Product = require('./product');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category must have a name.']
    },
    isDisplayed: {
        type: Boolean,
        default: false
    }
});

CategorySchema.methods.addProducts = async function(productIds){
    await Product.updateMany(
        {_id: {$in: productIds}},
        {$set: {category: this._id}}
    );
};

module.exports = mongoose.model('Category', CategorySchema);