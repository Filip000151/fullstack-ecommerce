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
    const {productId, shippingId, quantity} = req.body;

    await cartService.addToCart(userId, productId, shippingId, quantity);

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product added to cart'
    });
};

const updateCartItem = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;
    const {quantity} = req.body;

    await cartService.updateQuantity(userId, productId, quantity);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Cart updated'
    });
};

const removeFromCart = async (req, res) => {
    const {userId} = req.user;
    const {id: productId} = req.params;

    await cartService.removeFromCart(userId, productId);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product removed from cart'
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