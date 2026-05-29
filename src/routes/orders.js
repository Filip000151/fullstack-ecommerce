const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {getOrders, getOrder, createOrder, updateOrderStatus} = require('../controllers/orders');

router.use(authenticate);

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder)
    .patch(authorize('admin'), updateOrderStatus);

module.exports = router;