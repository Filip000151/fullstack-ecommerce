import cart from '../../api/cart.js';
import shipping from '../../api/shipping.js';
import auth from '../../api/auth.js';
import formatCurrency from '../../utils/money.js';

export function createElement(){
    const html = `
        <div class="buyer-details">
            <div class="cart-details">
                <h4 class="js-checkout-cart-quantity">Your cart (${cart.totalItems})</h4>
                <div class="cart-products js-cart-products">
                    ${renderProducts()}
                </div>
                <hr>
                <div class="shipping-button-wrapper">
                    <button class="primary-button js-show-shipping-button">Shipping options & delivery &darr;</button>
                </div>
            </div>
            <div class="checkout-lower-section js-checkout-shipping-section" style="visibility: hidden;">
                <div class="checkout-shipping">
                    <h4>Shipping options</h4>
                    <div class="checkout-shipping-options">
                        ${renderShippingOptions()}
                    </div>
                </div>
                <div class="checkout-delivery-info">
                    <h4>Enter your data</h4>
                    <form class="checkout-form">
                        ${auth.isGuest ? `
                        <div class="checkout-form-field">
                            <label for="">Email:</label>
                            <input class="js-email-input" type="email" placeholder="Please provide your email">
                            <span class="checkout-validation-error js-email-error"></span>
                        </div>
                        ` : ''}                  
                        <div class="checkout-form-field">
                            <label for="">Delivery address:</label>
                            <input class="js-address-input" type="text" placeholder="Please provide your address">
                            <span class="checkout-validation-error js-address-error"></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="order-summary-info js-order-summary-info">

        </div>
    `;
    let checkout = document.querySelector('.checkout');
    if(checkout){
        checkout.innerHTML = html;
    }
    else{
        checkout = document.createElement('section');
        checkout.classList.add('checkout');
        checkout.innerHTML = html;
        const container = document.querySelector('.container');
        container.appendChild(checkout);
    }
}

export function renderProducts(){
    let html = '';
    if(cart.items.length > 0){
        cart.items.forEach(item => {
            let timeoutId = null;
            html += `
                <div class="cart-product js-cart-product" data-product-id="${item.product._id}">
                    <div class="cart-product-image">
                        <img src="${item.product.coverImage}">
                    </div>
                    <div class="cart-product-info">
                        <a href="/products/${item.product._id}" class="cart-product-name">${item.product.name}</a>
                        <div class="cart-product-price">$${formatCurrency(item.product.priceCents)}</div>
                        <div class="cart-product-buttons">
                            <div class="cart-product-quantity">
                                <button class="cart-product-button js-cart-decrement-button" data-product-id="${item.product._id}">-</button>
                                <span class="cart-product-quantity-number js-cart-product-quantity-${item.product._id}">${item.quantity}</span>
                                <button class="cart-product-button js-cart-increment-button" data-product-id="${item.product._id}">+</button>
                                
                            </div>
                            <button class="delete-cart-product-button js-delete-cart-product-button" data-product-id="${item.product._id}">
                                <svg>
                                    <use href="images/icons/sprite.svg#trash-icon">
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    else{
        html = `
            <p class="checkout-empty-cart-text" style="justify-content: end">Your cart is empty...</p>
            <p class="checkout-empty-cart-text" style="justify-content: start"><a href="/products">Browse products here</a></p>
        `;
    }
    return html;
}

export function renderShippingOptions(){
    let html = '';
    if(shipping.list.length > 0){
        shipping.list.forEach((option, index) => {
            html += `
                <div class="checkout-shipping-option ${index === 0 ? 'radio-checked' : ''} js-checkout-shipping-option" data-shipping-price="${option.priceCents}" data-shipping-id="${option._id}" data-shipping-name="${option.name}">
                    <svg class="checkout-shipping-radio-icon" viewBox="0 0 24 24">
                        <circle class="outer-circle" cx="12" cy="12" r="9" stroke-width="2"/>
                        <circle class="inner-circle" cx="12" cy="12" r="5"/>
                    </svg>
                    <div class="checkout-shipping-option-info">
                        <p class="checkout-shipping-name">${option.name}</p>
                        <div class="checkout-shipping-price-days">
                            <p>Delivery time: ${option.deliveryDays} day(s)</p>
                            <p class="checkout-shipping-price">${option.priceCents > 0 ? `$${formatCurrency(option.priceCents)}` : 'FREE'}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    else{
        html = `
            <p class="checkout-no-shipping-options">Sorry, there are no shipping options available currently...</p>
        `;
    }
    
    return html;
}

export function renderOrderSummaryInfo(){
    const productTotalPrice = getProductTotalPrice();
    const shippingOption = document.querySelector('.radio-checked');
    
    let shippingInfo;
    if(shippingOption){
        const {shippingPrice, shippingName} = shippingOption.dataset;
        shippingInfo = {shippingPrice: Number(shippingPrice), shippingName};
    }

    const html = `
        <h4>Order summary</h4>
        <div class="checkout-price">
            <span>Product price: </span>
            <span>$${formatCurrency(productTotalPrice)}</span>
        </div>
        ${shippingInfo ? `
            <div class="checkout-price">
                <span>Shipping price(${shippingInfo.shippingName}): </span>
                <span>$${formatCurrency(shippingInfo.shippingPrice)}</span>
            </div>` 
            : ''}
        <hr>
        <div class="checkout-total-price">
            <span>Total price: </span>
            <span class="checkout-total-price-number">$${shippingInfo ? formatCurrency(productTotalPrice + shippingInfo.shippingPrice) : formatCurrency(productTotalPrice)}</span>
        </div>
        <div class="order-button-wrapper">
            <button class="make-order-button ${cart.items.length > 0 && shippingInfo ? 'js-make-order-button' : 'make-order-button-disabled'}">Make order</button>
        </div>
    `;

    return html;

    function getProductTotalPrice(){
        let total = 0;
        cart.items.forEach(item => {
            total += item.quantity * item.product.priceCents;
        });
        return total;
    }
}

export function renderCheckoutSkeleton(){
    const checkoutSkeleton = document.createElement('section');
    checkoutSkeleton.classList.add('checkout');
    const html = `
        <div class="buyer-details">
            <div class="cart-details">
                <div class="skeleton" style="width: 150px; height: 30px; margin: 2em;"></div>
                <div class="cart-products">
                    <div class="cart-product skeleton" style="height: 120px;"></div>
                    <div class="cart-product skeleton" style="height: 120px;"></div>
                    <div class="cart-product skeleton" style="height: 120px;"></div>
                    <div class="cart-product skeleton" style="height: 120px;"></div>
                </div>
                <hr>
                <div class="shipping-button-wrapper">
                    <div class="skeleton" style="width: 240px; height: 60px;"></div>
                </div>
            </div>
        </div>
        <div class="order-summary-info">
            <div class="skeleton" style="width: 200px; height: 30px; margin: 2em;"></div>
            <div class="checkout-price skeleton" style="height: 10px; margin: 0.5em 0;"></div>
            <div class="checkout-price skeleton" style="height: 10px; margin: 0.5em 0;"></div>
            <hr>
            <div class="checkout-total-price skeleton" style="height: 10px; margin: 0.5em 0;"></div>
            <div class="order-button-wrapper">
                <div class="skeleton" style="width: 180px; height: 40px; margin: 0.5em 0;"></div>
            </div>
        </div>
    `;
    checkoutSkeleton.innerHTML = html;
    const container = document.querySelector('.container');
    container.appendChild(checkoutSkeleton);
    return checkoutSkeleton;
}

export default createElement;