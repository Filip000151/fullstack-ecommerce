const { BadRequestError } = require('../errors');
const orderService = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const getOrders = async (req, res) => {
    const {userId, role, guestId} = req.user;

    const orders = await orderService.getOrders(role, userId, guestId);

    return res.status(StatusCodes.OK).json({
        success: true,
        count: orders.length,
        orders
    });
};

const getOrder = async (req, res) => {
    const {id} = req.params;
    const {userId, guestId, role} = req.user;

    const order = await orderService.getOrder(id, role, userId, guestId);

    return res.status(StatusCodes.OK).json({
        success: true,
        order
    });
};

const createOrder = async (req, res) => {
    const {userId, isGuest, guestId} = req.user;
    const {guestEmail, deliveryAddress, items, shippingId} = req.body;

    let order;

    if(isGuest){
        if(!items || items.length === 0){
            throw new BadRequestError('Cart is empty.');
        }
        order = await orderService.createGuestOrder(guestId, guestEmail, deliveryAddress, items, shippingId);
    }
    else
        order = await orderService.createOrderFromCart(userId, deliveryAddress, shippingId);

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Order created successfully'
    });
};

const cancelOrder = async (req, res) => {
    const {id} = req.params;
    const {userId, role, guestId, isGuest} = req.user;

    let order;

    if(isGuest){
        order = await orderService.cancelGuestOrder(id, guestId, role);
    }
    else{
        order = await orderService.cancelOrder(id, userId, role);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Order canceled'
    });
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    cancelOrder
};