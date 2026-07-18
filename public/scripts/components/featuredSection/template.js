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
                <a href="/products/${product._id}" class="featured-product-image js-featured-product" data-navigate>
                    <img src="${product.coverImage}">
                    <p>${product.name}</p>
                </a>
            `;
        });
        return html;
    }
}

export function renderFeaturedSectionSkeleton(){
    const featuredSectionSkeleton = document.createElement('section');
    featuredSectionSkeleton.classList.add('featured-section');
    const html = `
        <div class="skeleton skeleton-text" style="text-align: center; width: 200px; height: 32px; margin: 2em 0;"></div>
        <div class="featured-products-container">
            <div class="featured-product-image skeleton" style="height: 600px;"></div>
            <div class="featured-product-image skeleton" style="height: 600px;"></div>
        </div>
    `;
    featuredSectionSkeleton.innerHTML = html;
    const container = document.querySelector('.container');
    container.appendChild(featuredSectionSkeleton);
    return featuredSectionSkeleton;
}

export default createElement;