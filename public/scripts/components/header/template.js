import categories from '../../api/categories.js';
import products from '../../api/products.js';
import auth from '../../api/auth.js';
import cart from '../../api/cart.js';

import { getQueryParams } from '../../utils/query.js';
import formatCurrency from '../../utils/money.js';

export function renderElement() {
    const queryParams = getQueryParams();
    const categoryOptionsHTML = renderCategoryOptions();

    const displayCartQuantity = cart.totalItems > 0 ? `<span class="cart-quantity">${cart.totalItems}</span>` : '';

    const headerInnerHTML = `
        <div class="header">
            <a href="/" data-navigate>
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
                <button class="icon-button js-orders-button">
                    <svg class="svg-icon orders-icon">
                        <use href="images/icons/sprite.svg#orders-icon"></use>
                    </svg>
                    <span>Orders</span>
                </button>
                <button class="icon-button js-profile-button">
                    <svg class="svg-icon">
                        <use href="images/icons/sprite.svg#profile-icon"></use>
                    </svg>
                    <span>${auth.isGuest ? 'Profile' : auth.currentUser.name}</span>
                </button>
                <button class="icon-button js-cart-button">
                    ${displayCartQuantity}
                    <svg class="svg-icon cart-icon">
                        <use href="images/icons/sprite.svg#cart-icon"></use>
                    </svg>
                    <span>Cart</span>
                </button>
            </div>
        </header>
    `;

    let headerWrapper = document.querySelector(".header-wrapper");
    if (headerWrapper) headerWrapper.innerHTML = headerInnerHTML;
    else {
        headerWrapper = document.createElement('header');
        headerWrapper.classList.add('header-wrapper');
        headerWrapper.innerHTML = headerInnerHTML;

        document.body.appendChild(headerWrapper);
    }

    let overlay = document.querySelector('.overlay');
    if(overlay){
        document.body.removeChild(overlay);
    }
    overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    function renderCategoryOptions() {
        let html = '';
        categories.list.forEach((category) => {
            html += `
                    <option value="${category._id}" ${queryParams.category && queryParams.category === category._id ? "selected" : ""}>${category.name}</option>
                `;
        });
        return html;
    }
}

export function renderCartDropdown(){
    const html = `
        <div class="header-icon-dropdown-wrapper">
            <div class="cart-dropdown">
                <h4>Cart (${cart.totalItems} products)</h4>
                <div class="header-dropdown-scroll-wrapper">
                    <div class="header-cart-products">
                        ${renderCartProducts()}
                    </div>
                </div>
                <a href="/checkout" class="checkout-button-wrapper" data-navigate>
                    <button class="checkout-button">Go to checkout &rarr;</button>
                </a>
            </div>
        </div>
    `;
    return html;

    function renderCartProducts(){
        let html = '';
        cart.items.forEach(item => {
            html += `
                <div class="header-cart-product">
                    <div class="header-image-container">
                        <img src="${item.product.coverImage}">
                    </div>
                    <div class="header-cart-product-info">
                        <div class="header-cart-product-upper-section">
                            <a href="/products/${item.product._id}" class="header-cart-product-name" data-navigate>${item.product.name}</a>
                            <p class="header-product-price">$${formatCurrency(item.product.priceCents)}</p>
                        </div>
                        <div class="header-cart-product-lower-section">
                            <p>Quantity: ${item.quantity}</p>
                            <button class="header-product-remove-button js-header-remove-product-button" data-product-id="${item.product._id}">Remove</button>
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

export function renderSearchDropdown(searchText){
    const html = `
        <div class="search-dropdown">
            <p class="search-results-text">${searchText}</p>
            <hr>
            <div class="product-search-results-wrapper">
                <div class="product-search-results">
                    ${renderSearchProducts()}
                </div>
            </div>
        </div>
    `;

    function renderSearchProducts(){
        let html = '';
        if(products.list.length > 0){
            products.list.forEach(product => {
                html += `
                    <div class="search-product">
                        <div class="search-product-image-container">
                            <img src="${product.coverImage}">
                        </div>
                        <div class="search-product-info">
                            <a href="/products/${product._id}" class="search-product-name" data-navigate>${product.name}</a>
                            <p class="search-product-price">$${formatCurrency(product.priceCents)}</p>
                        </div>
                    </div>
                `;
            });
        }
        else{
            html = `No products found.`;
        }
        return html;
    }

    return html;
}

export function renderProfileDropdown(){
    let html = '';
    if(auth.isGuest){
        html = `
            <div class="header-icon-dropdown-wrapper">
                <div class="profile-dropdown">
                    <h4>You are not logged in.</h4>
                    <div class="dropdown-auth-buttons">
                        <a href="/login" data-navigate><button class="dropdown-auth-button">Login</button></a>
                        <a href="/register" data-navigate><button class="dropdown-auth-button">Register</button></a>
                    </div>
                </div>
            </div>
        `;
    }
    else if(auth.currentUser.role === 'client'){
        html = `
            <div class="header-icon-dropdown-wrapper">
                <div class="profile-dropdown">
                    <h4>Hello ${auth.currentUser.name}.</h4>
                    <div class="dropdown-auth-buttons">
                        <a href="/register" data-navigate><button class="dropdown-auth-button">Register account</button></a>
                        <button class="dropdown-auth-button js-logout-button">Logout</button>
                    </div>
                </div>
            </div>
        `;
    }
    else if(auth.currentUser.role === 'admin'){
        html = `
            <div class="header-icon-dropdown-wrapper">
                <div class="profile-dropdown">
                    <h4>Hello ${auth.currentUser.name}.</h4>
                    <div class="dropdown-auth-buttons">
                        <a href="/register" data-navigate><button class="dropdown-auth-button">Register account</button></a>
                        <a href="/dashboard" data-navigate><button class="dropdown-auth-button">Dashboard</button></a>
                        <button class="dropdown-auth-button js-logout-button">Logout</button>
                    </div>
                </div>
            </div>
        `;
    }
    return html;
}

export function renderHeaderSkeleton(){
    const headerSkeleton = document.createElement('header');
    const html = `
        <div class="header">
            <div class="header-logo skeleton"></div>
            <div class="search-section skeleton" style="height: 30px; width: 300px"></div>
            <div class="header-icons skeleton" style="height: 30px;"></div>
        </div>
    `;
    headerSkeleton.innerHTML = html;
    headerSkeleton.classList.add('header-wrapper');
    document.body.appendChild(headerSkeleton);
    return headerSkeleton;
}

export function renderSearchDropdownSkeleton(){
    const html = `
        <div class="search-dropdown">
            <div style="display: flex; justify-content: center;">
                <div class="skeleton" style="width: 150px; height: 30px; margin: 1em;"></div>
            </div>
            <hr>
            <div class="product-search-results-wrapper">
                <div class="product-search-results">
                    <div class="search-product skeleton" style="height: 80px;"></div>
                    <div class="search-product skeleton"></div>
                    <div class="search-product skeleton"></div>
                    <div class="search-product skeleton"></div>
                </div>
            </div>
        </div>
    `;
    return html;
}



export default renderElement;
