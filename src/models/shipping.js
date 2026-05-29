const mongoose = require('mongoose');
const CartDetails = require('./cartDetails');
const OrderDetails = require('./orderDetails');
const {BadRequestError} = require('../errors');

const ShippingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Shipping option must have a name.'],
        unique: true
    },
    deliveryDays: {
        type: Number,
        required: [true, 'Shipping option must have delivery days defined.']
    },
    priceCents: {
        type: Number,
        required: [true, 'Shipping option must have a price.']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

ShippingSchema.methods.softDelete = async function(){
    if(this.isDeleted === true){
        throw new BadRequestError('Shipping option already deleted.');
    }

    const shippingInOrder = await OrderDetails.findOne({shippingId: this._id});
    const shippingInCart = await CartDetails.findOne({shippingId: this._id});

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if(shippingInCart)
            await CartDetails.deleteMany({shippingId: this._id});

        if(shippingInOrder){
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

module.exports = mongoose.model('Shipping', ShippingSchema);