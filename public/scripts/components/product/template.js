import products from '../../api/products.js';
import formatCurrency from '../../utils/money.js';

export function createElement(){
    const html = `
        <div class="left-section">
            <div class="image-overlay js-image-overlay">
                <button class="close-image-overlay-button js-close-image-button">&#x2715;</button>
                <img src="${products.current.coverImage}">
            </div>
            <div class="product-images-section">
                <div class="product-image-display js-product-image-display">
                        <img src="${products.current.coverImage}" alt="">
                </div>
                <div class="product-images">
                    <button class="prev-image-button js-prev-image-button">&lt;</button>
                    <button class="next-image-button js-next-image-button">&gt;</button>
                    <div class="product-image-scroller">
                        ${renderProductImages()}
                    </div>
                </div>
            </div>
        </div>
        <div class="right-section">
            <h4 class="product-name">${products.current.name}</h4>
            <p class="product-price">$${formatCurrency(products.current.priceCents)}</p>
            <p class="product-category">Category: <a href="/products?category=${products.current.category._id}">${products.current.category.name}</a></p>
            <div class="product-add-to-cart-section">
                <button class="product-button js-decrement-button">-</button>
                <span class="product-quantity-number js-product-quantity">1</span>
                <button class="product-button js-increment-button">+</button>
                <button class="primary-button js-add-to-cart-button">Add to cart</button>
            </div>
        </div>
    `;

    let productElement = document.querySelector('.product');
    if(productElement){
        productElement.innerHTML = html;
    }
    else{
        productElement = document.createElement('section');
        productElement.classList.add('product');
        productElement.innerHTML = html;
        
        const container = document.querySelector('.container');
        container.appendChild(productElement);
    }

    function renderProductImages(){
        let html = `
            <div class="product-image js-product-image" data-image="${products.current.coverImage}" data-image-index="0">
                <div class="product-image-selected js-image-select"></div>
                <img src="${products.current.coverImage}" alt="" style="opacity: 1">
            </div>
        `;
        products.current.images.forEach((image, index) => {
            html += `
                <div class="product-image js-product-image" data-image="${image}" data-image-index="${index + 1}">
                    <img src="${image}" alt="">
                </div>
            `;
        });
        return html;
    }
}

export default createElement;