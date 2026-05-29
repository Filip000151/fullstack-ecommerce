const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const Shipping = require('../models/shipping');
const Product = require('../models/product');
const {StatusCodes} = require('http-status-codes');
const mongoose = require('mongoose');
const {NotFoundError} = require('../errors');
const order = require('../models/order');

class OrderService {
    async createOrder(userId, items){
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let totalPriceCents = 0;
            const orderDetails = [];

            for(const item of items){
                const product = await Product.findOne({_id: item.productId, isDeleted: false}).session(session);
                if(!product){
                    throw new NotFoundError(`No product found with id ${item.productId}`);
                }

                const shipping = await Shipping.findOne({_id: item.shippingId, isDeleted: false}).session(session);

                if(!shipping){
                    throw new NotFoundError(`No shipping option found with id ${item.shippingId}`);
                }

                const itemTotalCents = product.priceCents * item.quantity + shipping.priceCents;
                totalPriceCents += itemTotalCents;

                orderDetails.push({
                    productId: product._id,
                    shippingId: shipping._id,
                    quantity: item.quantity,
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

            const order = new Order({
                userId,
                totalPriceCents,
                status: 'pending'
            });

            await order.save({session});

            const orderDetailsWithId = orderDetails.map(detail => ({
                ...detail,
                orderId: order._id
            }));

            await OrderDetails.insertMany(orderDetailsWithId, {session});

            await session.commitTransaction();

            return true;
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

        const orderDetailsFormatted = [];
        orderDetails.forEach(item => {
            orderDetailsFormatted.push({
                productSnapshot: {
                    name: item.productSnapshot.name,
                    priceCents: item.productSnapshot.priceCents
                },
                shippingSnapshot: {
                    name: item.shippingSnapshot.name,
                    deliveryDays: item.shippingSnapshot.deliveryDays,
                    priceCents: item.shippingSnapshot.priceCents
                },
                quantity: item.quantity
            });
        });

        return {
            user: {
                name: order.userId.name,
                email: order.userId.email,
                id: order.userId._id
            },
            totalPriceCents: order.totalPriceCents,
            status: order.status,
            orderDate: order.orderDate,
            items: orderDetailsFormatted,
            itemCount: orderDetailsFormatted.length
        };
    }

    async getOrders(userId, role){
        if(role !== 'admin'){
            const orders = await Order.find({userId})
            .sort({createdAt: -1});
        
            const ordersFormatted = orders.map(item => {
                return {
                    _id: item._id,
                    totalPriceCents: item.totalPriceCents,
                    status: item.status,
                    orderDate: item.orderDate
                };
            })

            return ordersFormatted;
        }
        else{
            const orders = await Order.find()
                .sort({createdAt: -1});

            const ordersFormatted = orders.map(item => {
                return {
                    _id: item._id,
                    totalPriceCents: item.totalPriceCents,
                    status: item.status,
                    orderDate: item.orderDate
                };
            })

            return ordersFormatted;
        }
    }

    async getAllOrders(){
        const orders = await Order.find()
            .sort({createdAt: -1});

        const ordersWithDetails = await Promise.all(
            orders.map(order => this.getOrderWithDetails(order._id))
        );

        return ordersWithDetails;
    }
}

module.exports = new OrderService();