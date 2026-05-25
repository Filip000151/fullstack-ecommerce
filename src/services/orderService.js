const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const Shipping = require('../models/shipping');
const Product = require('../models/product');
const {StatusCodes} = require('http-status-codes');
const mongoose = require('mongoose');
const {NotFoundError} = require('../errors');

class OrderService {
    async createOrder(userId, items){
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let totalPrice = 0;
            const orderDetails = [];

            for(const item of items){
                const product = await Product.findById(item.productId).session(session);
                if(!product){
                    throw new NotFoundError(`No product found with id ${item.productId}`);
                }

                const shipping = await Shipping.findById(item.shippingId).session(session);

                if(!shipping){
                    throw new NotFoundError(`No shipping option found with id ${item.shippingId}`);
                }

                const itemTotal = product.price * item.quantity + shipping.price;
                totalPrice += itemTotal;

                orderDetails.push({
                    productId: product._id,
                    shippingId: shipping._id,
                    quantity: item.quantity,
                    productSnapshot: {
                        name: product.name,
                        price: product.price
                    },
                    shippingSnapshot: {
                        name: shipping.name,
                        deliveryDays: shipping.deliveryDays,
                        price: shipping.price
                    }
                });
            }

            const order = new Order({
                userId,
                totalPrice,
                status: 'pending'
            });

            await order.save({session});

            const orderDetailsWithId = orderDetails.map(detail => ({
                ...detail,
                orderId: order._id
            }));

            await OrderDetails.insertMany(orderDetailsWithId, {session});

            await session.commitTransaction();

            return this.getOrderWithDetails(order._id);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally{
            session.endSession();
        }
    }

    async getOrderWithDetails(orderId){
        const order = await Order.findById(orderId)
            .populate('userId', 'name email');

        if(!order) return null;

        const orderDetails = await OrderDetails.find({orderId})
            .populate('productId', 'name price')
            .populate('shippingId', 'name deliveryDays price');

        return {
            ...order.toObject(),
            items: orderDetails,
            itemCount: orderDetails.length
        };
    }

    async getUserOrders(userId){
        const orders = await Order.find({userId})
            .sort({createdAt: -1});
        
        const ordersWithDetails = await Promise.all(
            orders.map(order => this.getOrderWithDetails(order._id))
        );

        return ordersWithDetails;
    }
}

module.exports = new OrderService();