const Order = require('../models/order');
const Shipping = require('../models/shipping');
const Product = require('../models/product');
const Cart = require('../models/cart');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError, ForbiddenError} = require('../errors');

class OrderService {
    async createOrderFromCart(userId, deliveryAddress){
        const cart = await Cart.findOne({userId})
            .populate('items.productId')
            .populate('items.shippingId');

        if(!cart || cart.items.length === 0){
            throw new BadRequestError('Cart is empty');
        }

        let totalPriceCents = 0;
        const items = [];

        for(const item of cart.items){
            const product = item.productId;
            const shipping = item.shippingId;

            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + shipping.deliveryDays);

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents + shipping.priceCents;

            items.push({
                quantity: item.quantity,
                deliveryDate,
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents
                },
                shippingSnapshot: {
                    name: shipping.name,
                    deliveryDays: shipping.deliveryDays,
                    priceCents: shipping.priceCents
                }
            });
        }

        const order = await Order.create({
            userId,
            deliveryAddress,
            totalPriceCents,
            items,
            status: 'pending'
        });

        await Cart.findOneAndUpdate({userId}, {items: [], totalItems: 0});

        return order;
    }


    async createGuestOrder(guestEmail, deliveryAddress, cartItems){
        let totalPriceCents = 0;
        const items = [];

        for (const item of cartItems){
            const product = await Product.findOne({_id: item.productId, isDeleted: false});
            const shipping = await Shipping.findOne({_id: item.shippingId, isDeleted: false});

            if(!product || !shipping){
                throw new NotFoundError('No product or shipping option found.');
            }

            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + shipping.deliveryDays);

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents + shipping.priceCents;

            items.push({
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents
                },
                shippingSnapshot: {
                    name: shipping.name,
                    deliveryDays: shipping.deliveryDays,
                    priceCents: shipping.priceCents
                },
                quantity: item.quantity,
                deliveryDate
            });
        }

        const order = await Order.create({
            guestEmail,
            deliveryAddress,
            status: 'pending',
            totalPriceCents,
            items
        });

        return order;
    }

    async getOrder(orderId, userId){
        const order = await Order.findOne({_id: orderId, userId});

        if(!order){
            throw new NotFoundError('No order found.');
        }

        return order;
    }

    async getUserOrders(userId){
        const orders = await Order.find({userId})
            .sort({createdAt: -1});

        return orders;
    }

    async getAllOrders(){
        const query = {};
        
        const orders = await Order.find()
            .sort({createdAt: -1});
        
        return orders;
    }

    async updateOrderStatus(orderId, status){
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status},
            {returnDocument: 'after', runValidators: true}
        );

        if(!order){
            throw new NotFoundError('Order not found.');
        }

        return order;
    }

    async cancelOrder(orderId, userId, role){
        const order = await Order.findOne({
            _id: orderId
        });

        if(!order){
            throw new NotFoundError('Order not found.');
        }

        if(order.userId.toString() !== userId && role !== 'admin'){
            throw new ForbiddenError('You are not authorized to perform this action.');
        }

        if(order.status !== 'pending'){
            throw new BadRequestError('Only pending orders can be cancelled');
        }

        order.status = 'cancelled';
        await order.save();

        return order;
    }

    async linkGuestOrdersToUser(email, userId){
        const result = await Order.updateMany(
            {guestEmail: email, userId: null},
            {userId, guestEmail: null}
        );

        return result;
    }
}

module.exports = new OrderService();