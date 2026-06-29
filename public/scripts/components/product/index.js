import products from '../../api/products.js';
import {addToCart} from '../../api/cart.js';
import createElement from "./template.js";
import renderHeaderComponent from '../header/index.js';
import renderToast from '../../utils/toast.js';

export function renderProductComponent(){
    createElement();
    setImageEvents();
    setCartEvents();
}

function setImageEvents(){
    const imageElements = document.querySelectorAll('.js-product-image');
    const nextImageButton = document.querySelector('.js-next-image-button');
    const prevImageButton = document.querySelector('.js-prev-image-button');
    const imageDisplay = document.querySelector('.js-product-image-display');

    const imageOverlay = document.querySelector('.js-image-overlay');
    const closeOverlayButton = document.querySelector('.js-close-image-button');

    const scrollLimit = imageElements.length - 1;
    let counter = 0;
    
    imageElements.forEach(imageElement => {
        imageElement.addEventListener('click', () => {
            const {imageIndex} = imageElement.dataset;
            counter = Number(imageIndex);
            moveSelector();
            displayImage();
        });
    });

    nextImageButton.addEventListener('click', () => {
        if(counter < scrollLimit){
            counter += 1;
        }
        else{
            counter = 0;
        }
        moveSelector();
        displayImage();
    });

    prevImageButton.addEventListener('click', () => {
        if(counter > 0){
            counter -= 1;
        }
        else{
            counter = scrollLimit;
        }
        moveSelector();
        displayImage();
    });

    imageDisplay.addEventListener('click', () => {
        imageOverlay.style.display = 'flex';
        const img = imageOverlay.getElementsByTagName('img')[0];
        const src = imageDisplay.getElementsByTagName('img')[0].src;
        img.src = src;
    });
    closeOverlayButton.addEventListener('click', () => imageOverlay.style.display = 'none');
    imageOverlay.addEventListener('click', () => imageOverlay.style.display = 'none');

    function moveSelector(){
        const selection = document.querySelector('.js-image-select');
        selection.style.transform = `translateX(${170 * counter}px)`;
    }

    function displayImage(){
        const selectedImage = imageElements[counter];
        focusImage(selectedImage);
        
        const {image} = selectedImage.dataset;

        imageDisplay.innerHTML = `<img src="${image}" alt="">`;

        function focusImage(){
            imageElements.forEach(element => {
                const img = element.getElementsByTagName('img')[0];
                img.style.opacity = '0.6';
            });
            const selectedImg = selectedImage.getElementsByTagName('img')[0];
            selectedImg.style.opacity = '1';
            
            selectedImage.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
}

function setCartEvents(){
    const decrementButton = document.querySelector('.js-decrement-button');
    const incrementButton = document.querySelector('.js-increment-button');
    const addToCartButton = document.querySelector('.js-add-to-cart-button');

    decrementButton.addEventListener('click', () => {
        const quantityElement = document.querySelector('.js-product-quantity');
        const value = Number(quantityElement.textContent);
        if(value > 1){
            quantityElement.textContent = value - 1;
        }
    });

    incrementButton.addEventListener('click', () => {
        const quantityElement = document.querySelector('.js-product-quantity');
        const value = Number(quantityElement.textContent);
        if(value < 9){
            quantityElement.textContent = value + 1;
        }
    });

    addToCartButton.addEventListener('click', () => {
        const quantity = Number(document.querySelector('.js-product-quantity').textContent);
        const product = {
            productId: products.product._id,
            name: products.product.name,
            priceCents: products.product.priceCents,
            image: products.product.coverImage
        };
        addToCart(product, quantity);
        renderToast('Product added to cart!');
        renderHeaderComponent();
    });
}


export default renderProductComponent;