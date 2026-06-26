const Order = require('../models/order');
const Shipping = require('../models/shipping');
const Product = require('../models/product');
const Cart = require('../models/cart');
const {NotFoundError, BadRequestError, ForbiddenError, UnauthorizedError} = require('../errors');

class OrderService {
    async createOrderFromCart(userId, deliveryAddress, shippingId){
        const cart = await Cart.findOne({userId})
            .populate('items.productId');
        const shipping = await Shipping.findOne({_id: shippingId, isDeleted: false});

        if(!shipping){
            throw new NotFoundError('No shipping option found.');
        }

        if(!cart || cart.items.length === 0){
            throw new BadRequestError('Cart is empty');
        }

        let totalPriceCents = 0;
        const items = [];

        for(const item of cart.items){
            const product = item.productId;

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents;

            items.push({
                quantity: item.quantity,
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents,
                    images: product.images,
                    coverImage: product.coverImage
                }
            });
        }
        totalPriceCents += shipping.priceCents;

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + shipping.deliveryDays);

        const shippingSnapshot = {
            name: shipping.name,
            deliveryDays: shipping.deliveryDays,
            priceCents: shipping.priceCents
        };

        const order = await Order.create({
            userId,
            deliveryAddress,
            shippingSnapshot,
            deliveryDate,
            totalPriceCents,
            items,
            status: 'pending'
        });

        await Cart.findOneAndUpdate({userId}, {items: [], totalItems: 0});

        return order;
    }


    async createGuestOrder(guestId, guestEmail, deliveryAddress, cartItems, shippingId){
        if(!guestId){
            throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
        }
        
        const shipping = await Shipping.findOne({_id: shippingId, isDeleted: false});

        if(!shipping){
            throw new NotFoundError('No shipping option found.');
        }

        let totalPriceCents = 0;
        const items = [];

        for (const item of cartItems){
            const product = await Product.findOne({_id: item.productId, isDeleted: false});

            if(!product){
                throw new NotFoundError('No product found.');
            }

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents;

            items.push({
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents,
                    coverImage: product.coverImage,
                    images: product.images
                },
                quantity: item.quantity
            });
        }
        totalPriceCents += shipping.priceCents;

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + shipping.deliveryDays);

        const shippingSnapshot = {
            name: shipping.name,
            deliveryDays: shipping.deliveryDays,
            priceCents: shipping.priceCents
        };

        const order = await Order.create({
            guestId,
            guestEmail,
            deliveryAddress,
            shippingSnapshot,
            deliveryDate,
            status: 'pending',
            totalPriceCents,
            items
        });

        return order;
    }

    async getUserOrder(orderId, userId){
        const order = await Order.findOne({_id: orderId, userId});

        if(!order){
            throw new NotFoundError('No order found.');
        }

        const progress = this.calculateProgress(order);

        return {
            _id: order._id,
            deliveryDate: order.deliveryDate,
            totalPriceCents: order.totalPriceCents,
            status: order.status,
            items: order.items,
            shippingSnapshot: order.shippingSnapshot,
            createdAt: order.createdAt,
            progress
        };
    }

    async getGuestOrder(orderId, guestId){
        if(!guestId){
            throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
        }
        const order = await Order.findOne({_id: orderId, guestId});

        if(!order){
            throw new NotFoundError('No order found.');
        }

        const progress = this.calculateProgress(order);

        return {
            _id: order._id,
            deliveryDate: order.deliveryDate,
            totalPriceCents: order.totalPriceCents,
            status: order.status,
            items: order.items,
            shippingSnapshot: order.shippingSnapshot,
            createdAt: order.createdAt,
            progress
        };
    }

    async getGuestOrders(guestId){
        if(!guestId){
            throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
        }
        const orders = await Order.find({guestId})
            .sort({createdAt: -1});

        return orders;
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

    async cancelGuestOrder(orderId, guestId, role){
        const order = await Order.findOne({
            _id: orderId
        });

        if(!order){
            throw new NotFoundError('Order not found.');
        }

        if(!guestId){
            throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
        }

        if(order.guestId !== guestId && role !== 'admin'){
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

    async updateAllOrderStatuses(){
        const orders = await Order.find({
            status: {$nin: ['cancelled', 'delivered']}
        });

        let updatedCount = 0;
        
        for(const order of orders){
            const progress = this.calculateProgress(order);
            let newStatus;

            if(progress < 33) newStatus = 'pending';
            else if(progress < 67) newStatus = 'processing';
            else if(progress < 100) newStatus = 'shipped';
            else newStatus = 'delivered';

            if(order.status !== newStatus){
                order.status = newStatus;
                await order.save();
                updatedCount++;
            }
        }

        return {
            updatedCount,
            total: orders.length
        };
    }

    calculateProgress(order){
        const now = new Date();
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(order.deliveryDate);

        const totalDuration = deliveryDate - orderDate;
        const elapsedTime = now - orderDate;
        const progress = Math.min(100, Math.round((elapsedTime / totalDuration) * 100));
        
        return progress;
    }
}

module.exports = new OrderService();