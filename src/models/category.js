const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category must have a name.']
    },
    description: String
});

module.exports = mongoose.model('Category', CategorySchema);