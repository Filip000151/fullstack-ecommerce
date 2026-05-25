const cartService = require('../services/cartService');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const shipping = require('../models/shipping');


const getCart = async (req, res) => {
    const {userId} = req.user;

    const cart = await cartService.getCart(userId);

    res.status(StatusCodes.OK).json({
        success: true,
        cart
    });
};

const addToCart = async (req, res) => {
    const {userId} = req.user;
    const {productId, shippingId, quantity = 1} = req.body;

    if(!productId){
        throw new BadRequestError('Product id is required');
    }

    if(!shippingId){
        throw new BadRequestError('Shipping id is required');
    }

    const cartItem = await cartService.addToCart(userId, productId, shippingId, quantity);

    const cart = await cartService.getCart(userId);

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product added to cart',
        cart,
        addedItem: cartItem
    });
};

const updateCartItem = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;
    const {quantity} = req.body;

    if(!quantity || quantity < 0){
        throw new BadRequestError('Valid quantity is required');
    }

    const cartItem = await cartService.updateQuantity(userId, productId, quantity);

    const cart = await cartService.getCart(userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: quantity === 0 ? 'Product removed from cart' : 'Cart updated',
        cart
    });
};

const removeFromCart = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;

    await cartService.removeFromCart(userId, productId);

    const cart = await cartService.getCart(userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product removed from cart',
        cart
    });
};

const clearCart = async (req, res) => {
    const {userId} = req.user;

    await cartService.clearCart(userId);

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Cart cleared',
        cart: {
            items: [],
            subtotal: 0,
            shippingTotal: 0,
            total: 0,
            itemCount: 0
        }
    });
};

const getCartCount = async (req, res) => {
    const {userId} = req.user;

    const count = await cartService.getCartCount(userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        count
    });
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
};