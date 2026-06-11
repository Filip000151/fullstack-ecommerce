import products from "../api/products.js";

import formatCurrency from "../utils/money.js";

export function renderProductsSection(){
    createProductsSection();
    function createProductsSection(){
        const sectionInnerHtml = `
            <div class="filters">
                <div class="filter-section">
                    <h4>Price</h4>
                    <div class="price-range-selection">
                        <input type="number" placeholder="Min" class="filter-input">
                        <span>-</span>
                        <input type="number" placeholder="Max" class="filter-input">
                    </div>
                </div>
            </div>
            <div>
                <div class="sort-section">
                    <div class="sort-filter">
                        Sort By:
                        <select class="sort-input" name="" id="">
                            <option value="">Newest</option>
                            <option value="">Oldest</option>
                            <option value="">Highest Price</option>
                            <option value="">Lowest Price</option>
                            <option value="">Name A-Z</option>
                            <option value="">Name Z-A</option>
                        </select>
                    </div>
                </div>
                <div class="products-grid">
                    ${renderProducts()}
                </div>
                <div class="pagination">
                    <ul class="page-list">
                        <button class="prev-page-btn">&lt; Previous</button>
                        <li><button>1</button></li>
                        <li><button>2</button></li>
                        <li><button>3</button></li>
                        <li><button>4</button></li>
                        <li><button>5</button></li>
                        <li><button>6</button></li>
                        <li><button>7</button></li>
                        <li><button>8</button></li>
                        <li><button>9</button></li>
                        <button class="next-page-btn">Next &gt;</button>
                    </ul>
                </div>
            </div>
        `;

        let productsSection = document.querySelector('.products-section');
        if(productsSection){
            productsSection.innerHTML = sectionInnerHtml;
        }
        else{
            productsSection = document.createElement('section');
            productsSection.classList.add('products-section');
            productsSection.innerHTML = sectionInnerHtml;

            const container = document.querySelector('.container');
            container.appendChild(productsSection);
        }
    }
    function renderProducts(){
        let html = '';
        products.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="image-container">
                        <img src="${product.coverImage}">
                    </div>
                    <p class="product-name">${product.name}</p>
                    <div class="product-price-section">
                        <p class="product-price">$${formatCurrency(product.priceCents)}</p>
                        <button class="primary-button js-add-to-cart" data-product-id="${product._id}">Add to cart</button>
                    </div>
                    <div class="quantity-selection">
                        <span class="quantity-text">Quantity:</span>
                        <select class="quantity-input js-quantity-input-${product._id}">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                    </div>
                </div>
            `;
        });
        return html;
    }
}

export default renderProductsSection;