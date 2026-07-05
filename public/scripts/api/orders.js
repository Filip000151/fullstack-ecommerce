import apiClient from './apiClient.js';
import {cart, clearCart} from './cart.js';
import auth from './auth.js';
import renderToast from '../utils/toast.js';

export const orders = {
    userOrders: [],
    order: null
};

export async function createOrder(body = {}, redirect = {}){
    if(auth.isGuest){
        const items = cart.items.map(item => {
            return {
                productId: item.product._id,
                quantity: item.quantity
            };
        });
        body.items = items;
    }

    const data = await apiClient.post('/api/orders', body);

    if(data.success){
        clearCart();
        renderToast(data.msg, {toastDuration: 5000, redirect: redirect.redirect, beforeRedirect: redirect.beforeRedirect});
    }
    else{
        renderToast(data.msg, {toastDuration: 10000, success: false});
    }

    return data;
}

export async function cancelOrder(id){
    const data = await apiClient.delete(`/api/orders/${id}`);
    await loadOrder(id);

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