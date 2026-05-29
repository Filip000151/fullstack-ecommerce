const { BadRequestError, ForbiddenError, NotFoundError } = require('../errors');
const Order = require('../models/order');
const orderService = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const getOrders = async (req, res) => {
    const {userId, role} = req.user;

    const orders = await orderService.getOrders(userId, role);

    return res.status(StatusCodes.OK).json({
        success: true,
        count: orders.length,
        orders
    });
};

const getOrder = async (req, res) => {
    const {id} = req.params;
    const {userId, role} = req.user;

    const order = await orderService.getOrderWithDetails(id);

    if(!order){
        throw new BadRequestError('Order not found');
    }

    if(order.user.id.toString() !== userId && role !== 'admin'){
        throw new ForbiddenError('You can only view your own orders');
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        order
    });
};

const createOrder = async (req, res) => {
    const {userId} = req.user;
    const {items} = req.body;

    if(!items || items.length === 0){
        throw new BadRequestError('Order must contain at least one item.');
    }

    const order = await orderService.createOrder(userId, items);

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Order created successfully'
    });
};

const updateOrderStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const order = await Order.findByIdAndUpdate(
        id,
        {status},
        {runValidators: true}
    );

    if(!order){
        throw new NotFoundError('Order not found');
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Order status updated'
    });
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus
};