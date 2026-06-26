import apiClient from './apiClient.js';
import {cart, clearCart} from './cart.js';

export const orders = {
    userOrders: [],
    order: null
};

export async function createGuestOrder(guestEmail, deliveryAddress, shippingId){
    const items = cart.guestCart.map(item => {
        return {
            productId: item.product.productId,
            quantity: item.quantity
        };
    });

    const data = await apiClient.post('/api/orders', {
        guestEmail,
        deliveryAddress,
        shippingId,
        items
    });

    clearCart();

    return data;
}

export async function cancelOrder(id){
    const data = await apiClient.delete(`/api/orders/${id}`);

    return data;
}

export async function loadUserOrders(){
    const data = await apiClient.get('/api/orders');

    if(data.success){
        orders.userOrders = data.orders;
    }

    return data;
}

export async function loadOrder(id){
    const data = await apiClient.get(`/api/orders/${id}`);

    if(data.success){
        orders.order = data.order;
    }

    return data;
}

export default orders;