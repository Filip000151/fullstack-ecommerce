export function getHeader(){
    const headerInnerHTML = `
        <img src="images/logo.png" class="header-logo">
        <div class="search-section">
            <select name="" id="" class="category-selection">
                <option value="">All categories</option>
            </select>
            <input type="text" placeholder="Search products" class="search-bar">
            <button class="search-button">
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
                <svg class="svg-icon cart-icon">
                    <use href="images/icons/sprite.svg#cart-icon"></use>
                </svg>
                <span>Cart</span>
            </button>
        </div>
    `;

    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = headerInnerHTML;
    return header;
}

export default getHeader;