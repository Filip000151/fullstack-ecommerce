import apiClient from './apiClient.js';
import {cart, clearCart} from './cart.js';

export async function createGuestOrder(guestEmail, deliveryAddress, shippingId){
    const items = cart.guestCart.map(item => {
        return {
            productId: item.product.productId,
            quantity: item.quantity
        };
    });

    console.log(guestEmail, deliveryAddress, shippingId, items);

    const response = await apiClient.post('/api/orders', {
        guestEmail,
        deliveryAddress,
        shippingId,
        items
    });

    clearCart();
}