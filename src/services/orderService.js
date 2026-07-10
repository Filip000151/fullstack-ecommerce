const Order = require('../models/order');
const Shipping = require('../models/shipping');
const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const {NotFoundError, BadRequestError, ForbiddenError, UnauthorizedError} = require('../errors');

class OrderService {
    async createOrderFromCart(userId, deliveryAddress, shippingId){
        const cart = await Cart.findOne({userId})
            .populate('items.product');
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
            const product = item.product;

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents;

            items.push({
                quantity: item.quantity,
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents,
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
            user: userId,
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

        const user = await User.findOne({email: guestEmail});
        if(user){
            throw new BadRequestError('Email is already registered. Please log in.');
        }
        
        const shipping = await Shipping.findOne({_id: shippingId, isDeleted: false});

        if(!shipping){
            throw new NotFoundError('No shipping option found.');
        }

        let totalPriceCents = 0;
        const items = [];

        for (const item of cartItems){
            const product = await Product.findOne({_id: item.productId});

            if(!product){
                throw new NotFoundError('No product found.');
            }
            if(product.isDeleted){
                throw new BadRequestError('The product was deleted.', 'PRODUCT_DELETED');
            }

            const itemTotalCents = product.priceCents * item.quantity;
            totalPriceCents += itemTotalCents;

            items.push({
                productSnapshot: {
                    name: product.name,
                    priceCents: product.priceCents,
                    coverImage: product.coverImage
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

    async getOrder(orderId, role, userId, guestId){
        const queryObject = {_id: orderId};
        if(role === 'guest'){
            if(!guestId){
                throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
            }
            queryObject.guestId = guestId;
        }
        else if(role === 'client'){
            queryObject.user = userId;
        }
        else if(role === 'admin'){
            return await Order.findOne({...queryObject}).populate('user', 'name email');
        }

        const order = await Order.findOne(queryObject);

        if(!order){
            throw new NotFoundError('No order found.');
        }

        const progress = this.calculateProgress(order);

        return {
            ...order.toObject(),
            progress
        };
    }

    async getOrders(role, userId, guestId){
        const queryObject = {};
        if(role === 'guest'){
            if(!guestId){
                throw new UnauthorizedError('No guest ID found.', 'GUEST_ID_MISSING');
            }
            queryObject.guestId = guestId;
        }
        else if(role === 'client'){
            queryObject.user = userId;
        }
        else if(role === 'admin'){
            return await Order.find().sort({createdAt: -1});
        }

        const orders = await Order.find(queryObject)
            .select('-user -guestId')
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

        if(order.user.toString() !== userId && role !== 'admin'){
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
            {guestEmail: email, user: null},
            {user: userId, guestEmail: null, guestId: null}
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