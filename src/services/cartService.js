const Cart = require('../models/cart');
const Product = require('../models/product');
const Shipping = require('../models/shipping');
const {NotFoundError, BadRequestError} = require('../errors');

class CartService{
    async getCart(userId){
        let cart = await Cart.findOne({userId})
            .populate('items.productId', 'name priceCents images coverImage')
            .populate('items.shippingId', 'name price deliveryDays');

        if(!cart){
            cart = await Cart.create({userId, items: []});
        }

        return cart;
    }
    async addToCart(userId, productId, shippingId, quantity = 1){
        if(!productId){
            throw new BadRequestError('Product id is required');
        }
    
        if(!shippingId){
            throw new BadRequestError('Shipping id is required');
        }

        const cart = await Cart.findOne({userId, 'items.productId': productId});

        if(cart){
            return await Cart.findOneAndUpdate(
                {userId, 'items.productId': productId},
                {
                    $inc: {'items.$.quantity': quantity},
                    $set: {'items.$.shippingId': shippingId}
                },
                {returnDocuemnt: 'after', runValidators: true}
            );
        }
        else{
            return await Cart.findOneAndUpdate(
                {userId},
                {
                    $push: {items: {productId, shippingId, quantity}},
                    $inc: {totalItems: 1}
                },
                {upsert: true, new: true}
            );
        }
    }

    async updateQuantity(userId, productId, quantity){
        if(!quantity || quantity < 0){
            throw new BadRequestError('Valid quantity is required');
        }
        
        if(quantity < 1){
            return await this.removeFromCart(userId, productId);
        }

        return await Cart.findOneAndUpdate(
            {userId, 'items.productId': productId},
            {$set: {'items.$.quantity': quantity}},
            {returnDocument: 'after'}
        );
    }

    async removeFromCart(userId, productId){
        return await Cart.findOneAndUpdate(
            {userId},
            {
                $pull: {items: {productId}},
                $inc: {totalItems: -1}
            },
            {returnDocument: 'after'}
        );
    }

    async clearCart(userId){
        return await Cart.findOneAndUpdate(
            {userId},
            {items: [], totalItems: 0},
            {returnDocument: 'after'}
        );
    }
}

module.exports = new CartService();