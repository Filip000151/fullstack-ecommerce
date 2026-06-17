import categories from '../../api/categories.js';
import { getQueryParams } from '../../utils/query.js';
import formatCurrency from '../../utils/money.js';
import { cart, getCartQuantity } from '../../api/cart.js';

export function renderElement() {
    const queryParams = getQueryParams();
    const categoryOptionsHTML = renderCategoryOptions();
    const cartQuantity = getCartQuantity();
    const displayCartQuantity = cartQuantity > 0 ? `<span class="cart-quantity">${cartQuantity}</span>` : '';

    const headerInnerHTML = `
        <a href="/">
            <img src="images/logo.png" class="header-logo">
        </a>
        <div class="search-section">
            <select name="" id="" class="category-selection js-category-selection">
                <option value="">All categories</option>
                ${categoryOptionsHTML}
            </select>
            <input type="text" placeholder="Search products" class="search-bar js-search-bar" value="${queryParams.name ? queryParams.name : ""}">
            <button class="search-button js-search-button">
                <svg class="svg-icon">
                    <use href="images/icons/sprite.svg#search-icon"></use>
                </svg>
            </button>
        </div>
        <div class="header-icons">
            <button class="icon-button">
                <svg class="svg-icon orders-icon">
                    <use href="images/icons/sprite.svg#orders-icon"></use>
                </svg>
                <span>Orders</span>
            </button>
            <button class="icon-button">
                <svg class="svg-icon">
                    <use href="images/icons/sprite.svg#profile-icon"></use>
                </svg>
                <span>Profile</span>
            </button>
            <button class="icon-button js-cart-button">
                ${displayCartQuantity}
                <svg class="svg-icon cart-icon">
                    <use href="images/icons/sprite.svg#cart-icon"></use>
                </svg>
                <span>Cart</span>
            </button>
        </div>
    `;

    let header = document.querySelector(".header");
    if (header) header.innerHTML = headerInnerHTML;
    else {
        header = document.createElement("header");
        header.classList.add("header");
        header.innerHTML = headerInnerHTML;

        document.body.appendChild(header);
    }

    function renderCategoryOptions() {
        let html = "";
        categories.forEach((category) => {
            html += `
                    <option value="${category._id}" ${queryParams.category && queryParams.category === category._id ? "selected" : ""}>${category.name}</option>
                `;
        });
        return html;
    }
}

export function renderCartDropdown(){
    const html = `
        <h4>Cart (${getCartQuantity()} products)</h4>
        <div class="header-dropdown-scroll-wrapper">
            <div class="header-cart-products">
                ${renderCartProducts()}
            </div>
        </div>
        <button class="checkout-button">Go to checkout &rarr;</button>
    `;
    return html;

    function renderCartProducts(){
        let html = '';
        cart.guestCart.forEach(item => {
            html += `
                <div class="header-cart-product">
                    <div class="header-image-container">
                        <img src="${item.product.image}">
                    </div>
                    <div class="header-cart-product-info">
                        <div class="header-cart-product-upper-section">
                            <p>${item.product.name}</p>
                            <p class="header-product-price">$${formatCurrency(item.product.priceCents)}</p>
                        </div>
                        <div class="header-cart-product-lower-section">
                            <p>Quantity: ${item.quantity}</p>
                            <button class="header-product-remove-button js-header-remove-product-button" data-product-id="${item.product.productId}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        if(html.length === 0){
            html += `<p class="empty-cart-text">Cart is empty</p>`
        }
        return html;
    }
}

export default renderElement;
