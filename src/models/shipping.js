const mongoose = require('mongoose');
const Cart = require('./cart');
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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const carts = await Cart.updateMany(
            {'items.shippingId': this._id},
            {
                $pull: {items: {shippingId: this._id}},
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

module.exports = mongoose.model('Shipping', ShippingSchema);