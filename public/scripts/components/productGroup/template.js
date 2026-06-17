import formatCurrency from '../../utils/money.js';

export function renderElement(groupId, title, products){
    const productsHTML = renderProducts();
    const productGroupHTML = `
        <h3>${title}</h3>
        <button class="prev-button js-prev-button-${groupId}">&lt;</button>
        <button class="next-button js-next-button-${groupId}">&gt;</button>
        <div class="product-scroller js-product-scroller-${groupId}">
            ${productsHTML}
        </div>
    `;

    let productGroup = document.querySelector(`.js-product-group-${groupId}`);
    if(productGroup){
        productGroup.innerHTML = productGroupHTML;
    }
    else{
        const productGroup = document.createElement('section');
        productGroup.classList.add('product-group', `js-product-group-${groupId}`);
        productGroup.innerHTML = productGroupHTML;

        const container = document.querySelector('.container');
        container.appendChild(productGroup);
    }

    function renderProducts(){
        let html = '';
        products.forEach(product => {
            html += `
                <div class="product-card js-group-product-${groupId}">
                    <div class="image-container">
                        <img src="${product.coverImage}">
                    </div>
                    <p class="product-name">${product.name}</p>
                    <div class="product-price-section">
                        <p class="product-price">$${formatCurrency(product.priceCents)}</p>
                        <button class="primary-button js-add-to-cart-${groupId}" data-product-id="${product._id}" data-product-name="${product.name}" data-product-price="${product.priceCents}" data-product-image="${product.coverImage}">Add to cart</button>
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

export default renderElement;