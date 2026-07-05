const mongoose = require('mongoose');
const Cart = require('./cart');
const {BadRequestError} = require('../errors');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product must have a name.']
    },
    priceCents: {
        type: Number,
        required: [true, 'Product must have a price.']
    },
    coverImage: {
        type: String,
        required: [true, 'Product must have a cover image.']
    },
    images: [{
        type: String
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true
});

ProductSchema.methods.softDelete = async function(){
    if(this.isDeleted === true){
        throw new BadRequestError('Product already deleted.');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const carts = await Cart.updateMany(
            {'items.productId': this._id},
            {
                $pull: {items: {productId: this._id}},
                $inc: {totalItems: -1}
            },
            {session}
        );

        this.isDeleted = true;
        this.deletedAt = Date.now();
        await this.save({session});

        await session.commitTransaction();

        return true;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally{
        session.endSession();
    }
}

module.exports = mongoose.model('Product', ProductSchema);