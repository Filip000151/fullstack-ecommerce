const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart} = require('../controllers/cart');

router.use(authorize());

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/:id')
    .patch(updateCartItem)
    .delete(removeFromCart);


module.exports = router;