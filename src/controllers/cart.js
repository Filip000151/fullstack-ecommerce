const cartService = require('../services/cartService');
const {StatusCodes} = require('http-status-codes');

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
    const {productId, quantity} = req.body;

    const cart = await cartService.addToCart(userId, productId, quantity);

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product added to cart',
        cart
    });
};

const updateCartItem = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;
    const {quantity} = req.body;

    const cart = await cartService.updateQuantity(userId, productId, quantity);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Cart updated',
        cart
    });
};

const removeFromCart = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;

    const cart = await cartService.removeFromCart(userId, productId);

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
        msg: 'Cart cleared'
    });
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};