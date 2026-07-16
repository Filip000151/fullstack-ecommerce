import products from "../../api/products.js";

export function createElement(){
    const html = `
        <h3>Featured Products</h3>
        <button class="prev-button js-prev-button-featured">&lt;</button>
        <button class="next-button js-next-button-featured">&gt;</button>
        <div class="featured-product-scroller">
            <div class="featured-products-container js-featured-products-container">
            ${renderFeaturedProducts()}
            </div>
        </div>
    `;

    let featuredSection = document.querySelector('.featured-section');
    if(featuredSection){
        featuredSection.innerHTML = html;
    }
    else{
        featuredSection = document.createElement('section');
        featuredSection.classList.add('featured-section');
        featuredSection.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(featuredSection);
    }

    function renderFeaturedProducts(){
        let html = '';
        products.list.forEach(product => {
            html += `
                <a href="/products/${product._id}" class="featured-product-image js-featured-product">
                    <img src="${product.coverImage}">
                    <p>${product.name}</p>
                </a>
            `;
        });
        return html;
    }
}

export default createElement;