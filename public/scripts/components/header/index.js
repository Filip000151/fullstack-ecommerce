import createQueryString from "../../utils/query.js";
import {renderElement, renderCartDropdown} from "./template.js";
import { removeFromCart } from "../../api/cart.js";

export function renderHeaderComponent() {
    renderElement();

    setQueryEvents();
    setDropdownEvents();
}

    

function setQueryEvents(){
    const searchBar = document.querySelector('.js-search-bar');
    const categorySelection = document.querySelector('.js-category-selection');
    const searchButton = document.querySelector('.js-search-button');

    searchButton.addEventListener('click', queryProducts);
    searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            queryProducts();
        }
    });
    categorySelection.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            queryProducts();
        }
    });

    function queryProducts() {
        if (!window.location.href.includes('/products')) {
            const params = {
                category: categorySelection.value,
                name: searchBar.value,
            };
            const query = createQueryString(params);
            window.location.href = `/products${query}`;
        }
        return;
    }
}

function setDropdownEvents(){
    const overlay = document.querySelector('.overlay');
    const cartButton = document.querySelector('.js-cart-button');

    overlay.addEventListener('click', () => {
        const buttons = document.querySelectorAll('.icon-button');
        buttons.forEach(btn => {
            btn.classList.remove('icon-button-active');
        });
        removeDropdown();
        overlay.style.visibility = 'hidden';
    });

    cartButton.addEventListener('click', () => {
        const dropdown = document.querySelector('.dropdown-container');
        if(dropdown){
            cartButton.classList.remove('icon-button-active');
            removeDropdown();
            overlay.style.visibility = 'hidden';
        }
        else{
            addDropdown(renderCartDropdown());
            cartButton.classList.add('icon-button-active');
            overlay.style.visibility = 'visible';
            setProductRemoveButtonEvents();
        }   
        
    });

    function addDropdown(html = ''){
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown-container');
        dropdown.innerHTML = html;
        
        dropdown.animate([
            {transform: 'translateY(-700px)'},
            {transform: 'translateY(0)'}
        ], {
            duration: 200,
            easing: 'ease-in'
        });
    
        document.body.appendChild(dropdown);
    }
    async function removeDropdown(){
        const dropdown = document.querySelector('.dropdown-container');

        const slideOutAnimation = dropdown.animate([
            {transform: 'translateY(0)'},
            {transform: 'translateY(-700px)'}
        ], {
            duration: 200,
            easing: 'ease-out'
        });

        await slideOutAnimation.finished;
        document.body.removeChild(dropdown);
    }
    function setProductRemoveButtonEvents(){
        const removeButtons = document.querySelectorAll('.js-header-remove-product-button');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const {productId} = btn.dataset;
                removeFromCart(productId);
                renderHeaderComponent();
                const dropdown = document.querySelector('.dropdown-container');
                dropdown.innerHTML = renderCartDropdown();
                setProductRemoveButtonEvents();
                const cartButton = document.querySelector('.js-cart-button');
                cartButton.classList.add('icon-button-active');
            });
        });
    }
}

export default renderHeaderComponent;