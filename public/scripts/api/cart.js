import renderToast from '../utils/toast.js';
import apiClient from './apiClient.js';
import auth from './auth.js';

export const cart = {
    items: [],
    totalItems: 0
};

export async function loadCart(){
    if(auth.isGuest){
        const guestCart = JSON.parse(localStorage.getItem('cart')) || {items: [], totalItems: 0};
        cart.items = guestCart.items;

        let totalItems = 0;
        cart.items.forEach(item => {
            totalItems += item.quantity;
        });
        cart.totalItems = totalItems;
    }
    else{
        const data = await apiClient.get('/api/cart');
        if(data.success){
            cart.items = data.cart.items;
            cart.totalItems = data.cart.totalItems;
        }
    }
}

export async function addToCart(product, quantity){
    if(auth.isGuest){
        if(!cart.items.some(item => item.product._id === product._id)){
            cart.items.push({product, quantity});
        }
        else{
            const item = cart.items.find(item => item.product._id === product._id);
            item.quantity += quantity;
        }
        cart.totalItems += quantity;
        saveToStorage();
        renderToast('Product added to cart!');
    }
    else{
        const data = await apiClient.post('/api/cart', {productId: product._id, quantity});
        if(data.success){
            cart.items = data.cart.items;
            cart.totalItems = data.cart.totalItems;
            renderToast(data.msg);
        }
        else{
            renderToast(data.msg, {success: false});
        }
    }
}

export async function updateQuantity(productId, quantity){
    if(auth.isGuest){
        const item = cart.items.find(item => item.product._id === productId);
        cart.totalItems += quantity - item.quantity;
        item.quantity = quantity;
        saveToStorage();
    }
    else{
        const data = await apiClient.patch(`/api/cart/${productId}`, {quantity});
        if(data.success){
            cart.items = data.cart.items;
            cart.totalItems = data.cart.totalItems;
        }
    }    
}

export async function removeFromCart(productId){
    if(auth.isGuest){
        const item = cart.items.find(item => item.product._id === productId);
        cart.totalItems -= item.quantity;
        cart.items = cart.items.filter(item => item.product._id !== productId);
        saveToStorage();
        renderToast('Product removed from cart!');
    }
    else{
        const data = await apiClient.delete(`/api/cart/${productId}`);
        if(data.success){
            cart.items = data.cart.items;
            cart.totalItems = data.cart.totalItems;
            renderToast(data.msg);
        }
    }
    console.log(cart);
}

export async function clearCart(){
    if(auth.isGuest){
        cart.items = [];
        cart.totalItems = 0;
        saveToStorage();
    }
    else{
        const data = await apiClient.delete('/api/cart');
        if(data.success){
            cart.items = [];
            cart.totalItems = 0;
        }
    }
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export default cart;