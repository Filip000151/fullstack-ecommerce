import { removeFromCart, addToCart, updateQuantity, getCartQuantity } from "../../api/cart.js";
import { createGuestOrder } from "../../api/orders.js";
import renderToast from '../../utils/toast.js';
import {createElement, renderProducts, renderOrderSummaryInfo} from "./template.js";
import validateCheckoutInputs from "./validate.js";


export function renderCheckoutComponent(){
    createElement();
    const orderSummary = document.querySelector('.js-order-summary-info');
    orderSummary.innerHTML = renderOrderSummaryInfo(true);
    setCartEvents();
    setShippingEvents();
    setOrderEvents();
}

function setCartEvents(){
    const incrementButtons = document.querySelectorAll('.js-cart-increment-button');
    const decrementButtons = document.querySelectorAll('.js-cart-decrement-button');
    const deleteButtons = document.querySelectorAll('.js-delete-cart-product-button');
    const cartQuantity = document.querySelector('.js-checkout-cart-quantity');
    
    incrementButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const {productId} = btn.dataset;
            const quantity = document.querySelector(`.js-cart-product-quantity-${productId}`);
            const value = Number(quantity.textContent);
            if(value < 9){
                quantity.textContent = value + 1;
                updateQuantity(productId, value + 1);
                cartQuantity.innerText = `Your cart (${getCartQuantity()})`;
                const orderSummary = document.querySelector('.js-order-summary-info');
                orderSummary.innerHTML = renderOrderSummaryInfo();
                setOrderEvents();
            }
        });
    });

    decrementButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const {productId} = btn.dataset;
            const quantity = document.querySelector(`.js-cart-product-quantity-${productId}`);
            const value = Number(quantity.textContent);
            if(value > 1){
                quantity.textContent = value - 1;
                updateQuantity(productId, value - 1);
                cartQuantity.innerText = `Your cart (${getCartQuantity()})`;
                const orderSummary = document.querySelector('.js-order-summary-info');
                orderSummary.innerHTML = renderOrderSummaryInfo();
                setOrderEvents();
            }
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const {productId} = btn.dataset;
            removeFromCart(productId);
            renderToast('Product removed from cart!');
            cartQuantity.innerText = `Your cart (${getCartQuantity()})`;
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
            const deliveryAddress = document.querySelector('.js-address-input').value.trim();
            const guestEmail = document.querySelector('.js-email-input').value.trim();
            const shippingOption = document.querySelector('.radio-checked');
            const {shippingId} = shippingOption.dataset;
            await createGuestOrder(guestEmail, deliveryAddress, shippingId);
            renderToast('Order completed successfully!', {toastDuration: 8000, redirect: '/orders'});
        });
    }
}

export default renderCheckoutComponent;