import { cart, removeFromCart, addToCart, updateQuantity } from "../../api/cart.js";
import orders, { createOrder } from "../../api/orders.js";
import auth from '../../api/auth.js';
import {createElement, renderProducts, renderOrderSummaryInfo} from "./template.js";
import validateCheckoutInputs from "./validate.js";
import debounce from "../../utils/debounce.js";
import renderSpinner from '../../utils/spinner.js';


let updateFunctions;

export function renderCheckoutComponent(){
    createElement();
    const orderSummary = document.querySelector('.js-order-summary-info');
    orderSummary.innerHTML = renderOrderSummaryInfo();
    updateFunctions = new Map();
    setCartEvents();
    setShippingEvents();
    setOrderEvents();
}

function setCartEvents(){
    const incrementButtons = document.querySelectorAll('.js-cart-increment-button');
    const decrementButtons = document.querySelectorAll('.js-cart-decrement-button');
    const deleteButtons = document.querySelectorAll('.js-delete-cart-product-button');
    const cartQuantity = document.querySelector('.js-checkout-cart-quantity');

    const cartProducts = document.querySelectorAll('.js-cart-product');
    cartProducts.forEach(cartProduct => {
        const {productId} = cartProduct.dataset;
        const debouncedUpdate = debounce(async (newQuantity) => {
            await updateQuantity(productId, newQuantity);
            refreshCartUI();
        }, 500);
        updateFunctions.set(productId, debouncedUpdate);
    });
    
    incrementButtons.forEach(btn => {
        const {productId} = btn.dataset;
        const quantityElement = document.querySelector(`.js-cart-product-quantity-${productId}`);

        btn.addEventListener('click', () => {
            const value = Number(quantityElement.textContent);
            if(value < 9){
                const newQuantity = value + 1;
                quantityElement.textContent = newQuantity;
                updateFunctions.get(productId)(newQuantity);
            }
        });
    });

    decrementButtons.forEach(btn => {
        const {productId} = btn.dataset;
        const quantityElement = document.querySelector(`.js-cart-product-quantity-${productId}`);

        btn.addEventListener('click', () => {
            const value = Number(quantityElement.textContent);
            if(value > 1){
                const newQuantity = value - 1;
                quantityElement.textContent = newQuantity;
                updateFunctions.get(productId)(newQuantity);
            }
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const spinner = renderSpinner(document.body);
            const {productId} = btn.dataset;
            updateFunctions.get(productId).cancel();
            await removeFromCart(productId);
            spinner.remove();
            refreshCartUI();
        });
    });

    function refreshCartUI(){
        cartQuantity.innerText = `Your cart (${cart.totalItems})`;
        const cartProducts = document.querySelector('.js-cart-products');
        cartProducts.innerHTML = renderProducts();
        setCartEvents();
        const orderSummary = document.querySelector('.js-order-summary-info');
        orderSummary.innerHTML = renderOrderSummaryInfo();
        setOrderEvents();
    }
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
            const spinner = renderSpinner(document.body);

            if(hasPendingUpdates) await waitForUpdates();
            
            if(!validateCheckoutInputs()){
                const shippingSection = document.querySelector('.js-checkout-shipping-section');
                if(shippingSection.style.visibility === 'hidden'){
                    shippingSection.style.visibility = 'visible';
                    const shippingButton = document.querySelector('.js-show-shipping-button');
                    shippingButton.style.visibility = 'hidden';
                    shippingSection.scrollIntoView({behavior: 'smooth'});
                }
                spinner.remove();
                return;
            }
            const shippingOption = document.querySelector('.radio-checked');
            const {shippingId} = shippingOption.dataset;

            const body = {};
            body.deliveryAddress = document.querySelector('.js-address-input').value.trim();
            body.shippingId = shippingId;
            if(auth.isGuest) body.guestEmail = document.querySelector('.js-email-input').value.trim();
            await createOrder(body, {redirect: '/orders'});
            spinner.remove();
        });
    }

    function hasPendingUpdates(){
        for(const [productId, debouncedUpdate] of updateFunctions){
            if(debouncedUpdate.isPending) return true;
        }
        return false;
    }
    function waitForUpdates(){
        return new Promise(resolve => {
            setInterval(resolve, 500);
        });
    }
}

export default renderCheckoutComponent;