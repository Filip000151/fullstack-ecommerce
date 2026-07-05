const Cart = require('../models/cart');
const Product = require('../models/product');
const Shipping = require('../models/shipping');
const {NotFoundError, BadRequestError} = require('../errors');

class CartService{
    async getCart(userId){
        let cart = await Cart.findOne({userId})
            .populate('items.product', '_id name priceCents coverImage')
            .select('totalItems items -_id');

        if(!cart){
            cart = await Cart.create({userId, items: []});
        }

        return cart;
    }
    async addToCart(userId, productId, quantity = 1){
        if(!productId){
            throw new BadRequestError('Product id is required');
        }

        const cart = await Cart.findOne({userId, 'items.product': productId});

        if(cart){
            return await Cart.findOneAndUpdate(
                {userId, 'items.product': productId},
                {
                    $inc: {'items.$.quantity': quantity, totalItems: quantity}
                },
                {returnDocument: 'after', runValidators: true}
            ).populate('items.product', '_id name priceCents coverImage')
            .select('-_id -userId');
        }
        else{
            return await Cart.findOneAndUpdate(
                {userId},
                {
                    $push: {items: {product: productId, quantity}},
                    $inc: {totalItems: quantity}
                },
                {upsert: true, returnDocument: 'after', runValidators: true}
            ).populate('items.product', '_id name priceCents coverImage')
            .select('-_id -userId');
        }
    }

    async updateQuantity(userId, productId, quantity){
        if(!quantity || quantity < 0){
            throw new BadRequestError('Valid quantity is required');
        }
        
        if(quantity < 1){
            return await this.removeFromCart(userId, productId);
        }

        const currentItem = await Cart.findOne(
            { userId, 'items.product': productId },
            { 'items.$': 1 }
        );

        if(!currentItem){
            throw new NotFoundError('Product not found.');
        }

        const currentQuantity = currentItem.items[0].quantity;
        const quantityDiff = quantity - currentQuantity;

        return await Cart.findOneAndUpdate(
            {userId, 'items.product': productId},
            {
                $set: {'items.$.quantity': quantity},
                $inc: {totalItems: quantityDiff}
            },
            {returnDocument: 'after'}
        ).populate('items.product', '_id name priceCents coverImage')
        .select('-_id -userId');
    }

    async removeFromCart(userId, productId){
        const currentItem = await Cart.findOne(
            { userId, 'items.product': productId },
            { 'items.$': 1 }
        );

        if(!currentItem){
            throw new NotFoundError('Product not found.');
        }

        const itemQuantity = currentItem.items[0].quantity;

        return await Cart.findOneAndUpdate(
            {userId},
            {
                $pull: {items: {product: productId}},
                $inc: {totalItems: -itemQuantity}
            },
            {returnDocument: 'after'}
        ).populate('items.product', '_id name priceCents coverImage')
        .select('-_id -userId');
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