const mongoose = require('mongoose');
const CartDetails = require('./cartDetails');
const OrderDetails = require('./orderDetails');
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
    categoryId: {
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

    const productInOrder = await OrderDetails.findOne({productId: this._id});
    const productInCart = await CartDetails.findOne({productId: this._id});

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if(productInCart)
            await CartDetails.deleteMany({productId: this._id});
        
        if(productInOrder){
            this.isDeleted = true,
            this.deletedAt = Date.now();
            await this.save();
        }
        else
            await this.deleteOne();

        await session.commitTransaction();
        return this;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally{
        session.endSession();
    }
}

module.exports = mongoose.model('Product', ProductSchema);