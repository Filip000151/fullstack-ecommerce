const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category must have a name.']
    },
    description: String,
    isDisplayed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Category', CategorySchema);