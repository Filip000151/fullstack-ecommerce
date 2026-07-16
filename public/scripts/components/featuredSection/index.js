import createElement from "./template.js";

export function renderFeaturedSectionComponent(){
    createElement();
    setScrollEvents();
}

function setScrollEvents(){
    const prevButton = document.querySelector('.js-prev-button-featured');
    const nextButton = document.querySelector('.js-next-button-featured');
    const productContainer = document.querySelector('.js-featured-products-container');

    const productElements = document.querySelectorAll('.js-featured-product');
    const limit = Math.ceil(productElements.length / 2) - 1;
    let counter = 0;

    const displayButtons = limit > 0 ? 'block' : 'none';
    prevButton.style.display = displayButtons;
    nextButton.style.display = displayButtons;
    
    prevButton.addEventListener('click', () => {
        counter--;
        if(counter < 0) counter = limit;
        productContainer.style.transform = `translateX(-${counter * 1340}px)`;
    });
    nextButton.addEventListener('click', () => {
        counter++;
        if(counter > limit) counter = 0;
        productContainer.style.transform = `translateX(-${counter * 1340}px)`;
    });
}


export default renderFeaturedSectionComponent;