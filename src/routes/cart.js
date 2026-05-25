const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount } = require('../controllers/cart');

router.use(authenticate);

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/:id')
    .patch(updateCartItem)
    .delete(removeFromCart);

router.route('/count').get(getCartCount);



module.exports = router;