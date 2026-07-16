import {addToCart} from '../../api/cart.js';
import renderToast from '../../utils/toast.js';
import renderSpinner from '../../utils/spinner.js';

import renderElement from './template.js';
import renderHeaderComponent from '../header/index.js';

export function renderProductGroupComponent(groupId, title, products){
    renderElement(groupId, title, products);
    setEvents(groupId);
}

function setEvents(groupId){
    let counter = 0;
    const visibleCards = 4;
    const productCards = document.querySelectorAll(`.js-group-product-${groupId}`);
    const scroller = document.querySelector(`.js-product-scroller-${groupId}`);
    const scrollLimit = Math.floor(productCards.length / visibleCards);

    const nextButton = document.querySelector(`.js-next-button-${groupId}`);
    const prevButton = document.querySelector(`.js-prev-button-${groupId}`);

    if(counter === scrollLimit)
        nextButton.style.visibility = 'hidden';
    if(counter === 0)
        prevButton.style.visibility = 'hidden';

    nextButton.addEventListener('click', () => {
        if(counter < scrollLimit){
            counter++;
            scroller.style.transform = `translateX(-${counter * 100}%)`;
            prevButton.style.visibility = 'visible';
        }
        if(counter === scrollLimit)
            nextButton.style.visibility = 'hidden';
    });
    prevButton.addEventListener('click', () => {
        if(counter > 0){
            counter--;
            scroller.style.transform = `translateX(-${counter * 100}%)`;
            nextButton.style.visibility = 'visible';
        }
        if(counter === 0)
            prevButton.style.visibility = 'hidden';
    });

    const addButtons = document.querySelectorAll(`.js-add-to-cart-${groupId}`);
    addButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const spinner = renderSpinner(document.body);
            const {productId:_id, productName:name, productPrice:priceCents, productImage:coverImage} = btn.dataset;
            const quantity = Number(document.querySelector(`.js-quantity-input-${_id}`).value);
            const product = {
                _id,
                name,
                priceCents,
                coverImage
            };
            await addToCart(product, quantity);
            spinner.remove();
            renderHeaderComponent();
        });
    });
}

export default renderProductGroupComponent;