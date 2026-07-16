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
    const productCards = document.querySelectorAll(`.js-group-product-${groupId}`);
    const limit = Math.ceil(productCards.length / 4) - 1;
    let counter = 0;

    const nextButton = document.querySelector(`.js-next-button-${groupId}`);
    const prevButton = document.querySelector(`.js-prev-button-${groupId}`);
    const productContainer = document.querySelector(`.js-product-container-${groupId}`);

    toggleButtons();

    nextButton.addEventListener('click', () => {
        if(counter < limit){
            counter++;
            productContainer.style.transform = `translateX(-${counter * 1408}px)`;
            toggleButtons();
        }
    });
    prevButton.addEventListener('click', () => {
        if(counter > 0){
            counter--;
            productContainer.style.transform = `translateX(-${counter * 1408}px)`;
            toggleButtons();
        }
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

    function toggleButtons(){
        prevButton.style.display = counter > 0 ? 'block' : 'none';
        nextButton.style.display = counter < limit ? 'block' : 'none';
    }
}

export default renderProductGroupComponent;