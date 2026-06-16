import categories from '../../api/categories.js';
import { getQueryParams } from '../../utils/query.js';
import { getCartQuantity } from '../../api/cart.js';

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
            <button class="icon-button">
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

export default renderElement;
