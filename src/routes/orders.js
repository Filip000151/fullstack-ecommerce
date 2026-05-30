const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {getOrders, getOrder, createOrder, updateOrderStatus, cancelOrder} = require('../controllers/orders');

router.route('/')
    .get(authorize(), getOrders)
    .post(createOrder);

router.route('/:id')
    .get(authorize(), getOrder)
    .patch(authorize('admin'), updateOrderStatus)
    .delete(authorize(), cancelOrder);

    
module.exports = router;