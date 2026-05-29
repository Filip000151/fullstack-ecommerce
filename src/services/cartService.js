const CartDetails = require('../models/cartDetails');
const Product = require('../models/product');
const Shipping = require('../models/shipping');
const {NotFoundError} = require('../errors');
const cartDetails = require('../models/cartDetails');

class CartService{
    async addToCart(userId, productId, shippingId, quantity = 1){
        const product = Product.findOne({_id: productId, isDeleted: false});
        if(!product){
            throw new NotFoundError(`Product with id ${productId} not found`);
        }

        const shipping = await Shipping.findOne({_id: shippingId, isDeleted: false});
        if(!shipping){
            throw new NotFoundError(`Shipping option with id ${shippingId} not found`);
        }

        let cartItem = await CartDetails.findOne({userId, productId});

        if(cartItem){
            cartItem.quantity += quantity;
            cartItem.shippingId = shippingId;
            await cartItem.save();
        }
        else{
            cartItem = await CartDetails.create({
                userId,
                productId,
                shippingId,
                quantity
            });
        }
        return cartItem;
    }

    async updateQuantity(userId, productId, quantity){
        if(quantity < 1){
            return this.removeFromCart(userId, productId);
        }

        const cartItem = await CartDetails.findOneAndUpdate(
            {userId, productId},
            {quantity},
            {new: true, runValidators: true}
        );

        if(!cartItem){
            throw new NotFoundError('Product not found in cart');
        }

        return cartItem;
    }

    async removeFromCart(userId, productId){
        const result = await CartDetails.findOneAndDelete({userId, productId});

        if(!result){
            throw new NotFoundError('Product not found in cart');
        }

        return result;
    }

    async getCart(userId){
        const cartItems = await CartDetails.find({userId})
            .populate('productId', 'name price')
            .populate('shippingId', 'name deliveryDays price');

        if(!cartItems || cartItems.length === 0){
            return {
                items: [],
                subtotal: 0,
                shippingTotal: 0,
                total: 0,
                itemCount: 0
            };
        }

        let subtotal = 0;
        let shippingTotal = 0;

        const items = cartItems.map(item => {
            const productPrice = item.productId.priceCents;
            const itemTotal = productPrice * item.quantity;
            subtotal += itemTotal;
            shippingTotal += item.shippingId.priceCents;

            return {
                productName: item.productId.name,
                productPrice: productPrice,
                quantity: item.quantity,
                itemTotal: itemTotal,
                shipping: {
                    name: item.shippingId.name,
                    deliveryDays: item.shippingId.deliveryDays,
                    cost: item.shippingId.priceCents
                }
            };
        });

        return {
            items,
            subtotal: subtotal,
            shippingTotal: shippingTotal,
            total: subtotal + shippingTotal,
            itemCount: cartItems.length
        };
    }

    async clearCart(userId){
        const result = await CartDetails.deleteMany({userId});
        return result;
    }

    async getCartCount(userId){
        const count = await CartDetails.countDocuments({userId});
        return count;
    }
}

module.exports = new CartService();