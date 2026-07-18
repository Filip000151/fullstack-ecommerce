import products from "../../api/products.js";
import formatCurrency from '../../utils/money.js';
import { getQueryParams } from '../../utils/query.js';

export function renderElement(){
    const queryParams = getQueryParams();
    const sectionInnerHtml = `
        <div class="sort-section">
            <div class="sort-filter">
                Sort By:
                <select class="sort-input js-sort-input">
                    ${renderSortOptions()}
                </select>
            </div>
        </div>
        <div class="product-filter-section">
            <div class="filters">
                <div class="filter-section">
                    <h4>Price</h4>
                    <div class="price-range-text">
                        <p class="js-min-price-text">$${queryParams.minPrice !== undefined ? formatCurrency(queryParams.minPrice) : '0.00'}</p>
                        <span>-</span>
                        <p class="js-max-price-text">${queryParams.maxPrice !== undefined ? formatCurrency(queryParams.maxPrice) : 'Max'}</p>
                    </div>
                    <div class="price-range-selection">
                        <input type="number" placeholder="Min" class="filter-input js-filter-input js-min-price-input" data-filter-type="minPrice" value="${queryParams.minPrice !== undefined ? formatCurrency(queryParams.minPrice) : ''}">
                        <span>-</span>
                        <input type="number" placeholder="Max" class="filter-input js-filter-input js-max-price-input" data-filter-type="maxPrice" value="${queryParams.maxPrice !== undefined ? formatCurrency(queryParams.maxPrice) : ''}">
                    </div>
                </div>
            </div>
            <div class="products-grid">
                ${renderProducts()}
            </div>
        </div>
        <div class="pagination">
            <ul class="page-list">
                ${renderPagination()}
            </ul>
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

    function renderSortOptions(){
        const sortList = [
            {name: 'Newest', value: undefined},
            {name: 'Name A-Z', value: 'name'},
            {name: 'Name Z-A', value: '-name'},
            {name: 'Highest Price', value: '-priceCents'},
            {name: 'Lowest Price', value: 'priceCents'}
        ];

        let html = '';
        sortList.forEach(option => {
            html += `
                <option value="${option.value !== undefined ? option.value : ''}" ${queryParams.sort === option.value ? 'selected' : ''}>
                    ${option.name}
                </option>
            `;
        });
        return html;
    }
}

export function renderPagination(){
    const pagination = products.pagination;
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    const startPage = 1;

    if(pagination.totalPages <= 1){
        return '';
    }

    let html = '';

    const prevDisabled = pagination.hasPrevPage ? 'js-pagination-button' : 'disabled';
    html += `
        <button class="prev-page-btn ${prevDisabled}" data-page-number="${currentPage - 1}">
            &lt; Previous
        </button>
    `;
    
    const isStartPage = currentPage === startPage;
    const isLastPage = currentPage === totalPages;
    html += `
        <li><button class="${isStartPage ? 'active' : 'js-pagination-button'}" data-page-number="1">1</button></li>
    `;
    if(!isStartPage){
        if(currentPage - 2 > startPage){
            html += `<li><span>...</span></li>`;
        }
        if(currentPage - 1 > startPage){
            html += `<li><button class="js-pagination-button" data-page-number="${currentPage - 1}">${currentPage - 1}</button></li>`;
        }
        html += `<li><button class="active">${currentPage}</button></li>`;
    }
    if(!isLastPage){
        if(currentPage + 1 < totalPages){
            html += `<li><button class="js-pagination-button" data-page-number="${currentPage + 1}">${currentPage + 1}</button></li>`
        }
        if(currentPage + 2 < totalPages){
            html += `<li><span>...</span></li>`;
        }
        html += `<li><button class="js-pagination-button" data-page-number="${totalPages}">${totalPages}</button></li>`
    }

    const nextDisabled = pagination.hasNextPage ? 'js-pagination-button' : 'disabled';
    html += `
        <button class="next-page-btn ${nextDisabled}" data-page-number="${currentPage + 1}">
            Next &gt;
        </button>
    `;
    return html;
}

export function renderProducts(){
    let html = '';
    if(products.list && products.list.length > 0){
        products.list.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="image-container">
                        <img src="${product.coverImage}">
                    </div>
                    <a href="/products/${product._id}" class="product-name" data-navigate>${product.name}</a>
                    <div class="product-price-section">
                        <p class="product-price">$${formatCurrency(product.priceCents)}</p>
                        <button class="primary-button js-add-to-cart" data-product-id="${product._id}" data-product-name="${product.name}" data-product-price="${product.priceCents}" data-product-image="${product.coverImage}">Add to cart</button>
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
    }
    else{
        html = `
            <img class="no-products-found-image" src="images/no_products_found.webp"/>
        `;
    }
    return html;
}

export function renderProductSectionSkeleton(){
    const productSection = document.createElement('section');
    productSection.classList.add('products-section');
    const html = `
        <div class="sort-section">
            <div class="sort-filter skeleton" style="width: 200px; height: 40px;"></div>
        </div>
        <div class="product-filter-section">
            <div class="filters">
                <div class="filter-section skeleton" style="width: 400px; height: 150px;"></div>
            </div>
            <div class="products-grid">
                ${renderProductsSkeleton()}
            </div>
        </div>
        <div class="pagination">
            <ul class="page-list skeleton" style="width: 300px; height: 50px;"></ul>
        </div>
    `;
    productSection.innerHTML = html;
    const container = document.querySelector('.container');
    container.appendChild(productSection);
    return productSection;
}

export function renderProductsSkeleton(){
    const html = `
        <div class="product-card skeleton"></div>
        <div class="product-card skeleton"></div>
        <div class="product-card skeleton"></div>
        <div class="product-card skeleton"></div>
        <div class="product-card skeleton"></div>
        <div class="product-card skeleton"></div>
    `;

    return html;
}

export default renderElement;