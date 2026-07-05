import { cart, removeFromCart, addToCart, updateQuantity } from "../../api/cart.js";
import { createOrder } from "../../api/orders.js";
import auth from '../../api/auth.js';
import {createElement, renderProducts, renderOrderSummaryInfo} from "./template.js";
import validateCheckoutInputs from "./validate.js";


export function renderCheckoutComponent(){
    createElement();
    const orderSummary = document.querySelector('.js-order-summary-info');
    orderSummary.innerHTML = renderOrderSummaryInfo();
    setCartEvents();
    setShippingEvents();
    setOrderEvents();
}

function setCartEvents(){
    const incrementButtons = document.querySelectorAll('.js-cart-increment-button');
    const decrementButtons = document.querySelectorAll('.js-cart-decrement-button');
    const deleteButtons = document.querySelectorAll('.js-delete-cart-product-button');
    const cartQuantity = document.querySelector('.js-checkout-cart-quantity');

    const cartProducts = document.querySelectorAll('.cart-product');
    const elementTimers = new WeakMap();
    cartProducts.forEach(cartProduct => {
        elementTimers.set(cartProduct, null);
    });
    
    incrementButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const {productId} = btn.dataset;
            const quantity = document.querySelector(`.js-cart-product-quantity-${productId}`);
            const value = Number(quantity.textContent);
            const cartProduct = document.querySelector(`.js-cart-product-${productId}`);
            if(value < 9){
                quantity.textContent = value + 1;
                const timeoutId = elementTimers.get(cartProduct); 
                if(timeoutId) clearTimeout(timeoutId);
                elementTimers.set(cartProduct, setTimeout(async () => {
                    elementTimers.set(cartProduct, null);
                    await updateQuantity(productId, value + 1);
                    cartQuantity.innerText = `Your cart (${cart.totalItems})`;
                    const orderSummary = document.querySelector('.js-order-summary-info');
                    orderSummary.innerHTML = renderOrderSummaryInfo();
                    setOrderEvents();
                }, 700)); 
            }
        });
    });

    decrementButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const {productId} = btn.dataset;
            const quantity = document.querySelector(`.js-cart-product-quantity-${productId}`);
            const value = Number(quantity.textContent);
            const cartProduct = document.querySelector(`.js-cart-product-${productId}`);
            if(value > 1){
                quantity.textContent = value - 1;
                const timeoutId = elementTimers.get(cartProduct); 
                if(timeoutId) clearTimeout(timeoutId);
                elementTimers.set(cartProduct, setTimeout(async () => {
                    elementTimers.set(cartProduct, null);
                    await updateQuantity(productId, value - 1);
                    cartQuantity.innerText = `Your cart (${cart.totalItems})`;
                    const orderSummary = document.querySelector('.js-order-summary-info');
                    orderSummary.innerHTML = renderOrderSummaryInfo();
                    setOrderEvents();
                }, 700));
            }
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const {productId} = btn.dataset;
            await removeFromCart(productId);
            cartQuantity.innerText = `Your cart (${cart.totalItems})`;
            const cartProducts = document.querySelector('.js-cart-products');
            cartProducts.innerHTML = renderProducts();
            setCartEvents();
            const orderSummary = document.querySelector('.js-order-summary-info');
            orderSummary.innerHTML = renderOrderSummaryInfo();
            setOrderEvents();
        });
    });
}

function setShippingEvents(){
    const shippingButton = document.querySelector('.js-show-shipping-button');
    const shippingOptions = document.querySelectorAll('.js-checkout-shipping-option');

    shippingButton.addEventListener('click', () => {
        const shippingSection = document.querySelector('.js-checkout-shipping-section');
        shippingSection.style.visibility = 'visible';
        shippingButton.style.visibility = 'hidden';
    });

    shippingOptions.forEach(option => {
        option.addEventListener('click', () => {
            uncheckAllButtons();
            option.classList.add('radio-checked');
            const orderSummary = document.querySelector('.js-order-summary-info');
            orderSummary.innerHTML = renderOrderSummaryInfo();
            setOrderEvents();
        });
    });

    function uncheckAllButtons(){
        shippingOptions.forEach(option => {
            option.classList.remove('radio-checked');
        });
    }
}

function setOrderEvents(){
    const makeOrderButton = document.querySelector('.js-make-order-button');
    if(makeOrderButton){
        makeOrderButton.addEventListener('click', async () => {
            if(!validateCheckoutInputs()){
                const shippingSection = document.querySelector('.js-checkout-shipping-section');
                if(shippingSection.style.visibility === 'hidden'){
                    shippingSection.style.visibility = 'visible';
                    const shippingButton = document.querySelector('.js-show-shipping-button');
                    shippingButton.style.visibility = 'hidden';
                    shippingSection.scrollIntoView({behavior: 'smooth'});
                }
                return;
            }
            const shippingOption = document.querySelector('.radio-checked');
            const {shippingId} = shippingOption.dataset;

            const body = {};
            body.deliveryAddress = document.querySelector('.js-address-input').value.trim();
            body.shippingId = shippingId;
            if(auth.isGuest) body.guestEmail = document.querySelector('.js-email-input').value.trim();
            await createOrder(body, {redirect: '/orders'});
        });
    }
}

export default renderCheckoutComponent;