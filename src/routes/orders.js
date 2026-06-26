const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {getOrders, getOrder, createOrder, cancelOrder} = require('../controllers/orders');

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder)
    .delete(cancelOrder);

    
module.exports = router;