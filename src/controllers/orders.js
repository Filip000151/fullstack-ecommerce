const { BadRequestError } = require('../errors');
const orderService = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const getOrders = async (req, res) => {
    const {userId, role} = req.user;

    let orders;

    if(role === 'admin'){
        orders = await orderService.getAllOrders();
    }
    else{
        orders = await orderService.getUserOrders(userId);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        count: orders.length,
        orders
    });
};

const getOrder = async (req, res) => {
    const {id} = req.params;
    const {userId} = req.user;

    const order = await orderService.getOrder(id, userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        order
    });
};

const createOrder = async (req, res) => {
    const {userId, isGuest} = req.user;
    const {guestEmail, deliveryAddress, items} = req.body;

    let order;

    if(isGuest){
        if(!items || items.length === 0){
            throw new BadRequestError('Cart is empty.');
        }
        order = await orderService.createGuestOrder(guestEmail, deliveryAddress, items);
    }
    else
        order = await orderService.createOrderFromCart(userId, deliveryAddress);

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Order created successfully'
    });
};

const updateOrderStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const order = await orderService.updateOrderStatus(id, status);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Order status updated'
    });
};

const cancelOrder = async (req, res) => {
    const {id} = req.params;
    const {userId, role} = req.user;

    const order = await orderService.cancelOrder(id, userId, role);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Order canceled'
    });
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder
};