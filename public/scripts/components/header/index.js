import createQueryString from "../../utils/query.js";
import renderToast from "../../utils/toast.js";
import {renderElement, renderCartDropdown, renderSearchDropdown, renderProfileDropdown} from "./template.js";
import { removeFromCart } from "../../api/cart.js";
import { queryProducts } from "../../api/products.js";
import { logoutUser } from "../../api/auth.js";

const dropdownHandler = createDropdownHandler();
let queryEvent;

export function renderHeaderComponent(customQueryEvent) {
    renderElement();

    const overlay = document.querySelector('.overlay');
    overlay.addEventListener('click', dropdownHandler().closeDropdown);

    queryEvent = customQueryEvent ? customQueryEvent : setDefaultQueryEvents;
    queryEvent();

    setCartEvents();
    setOrdersEvent();
    setProfileEvents();
}

function setDefaultQueryEvents(){
    const searchBar = document.querySelector('.js-search-bar');
    const categorySelection = document.querySelector('.js-category-selection');
    const searchButton = document.querySelector('.js-search-button');

    const overlay = document.querySelector('.overlay');

    searchBar.addEventListener('focus', querySearchProducts);
    categorySelection.addEventListener('change', querySearchProducts);

    searchButton.addEventListener('click', goToProducts);
    searchBar.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            goToProducts();
        }
        else{
            querySearchProducts();
        }
    });
    categorySelection.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            goToProducts();
        }
    });
    
    async function querySearchProducts(){
        let params = {};
        let searchText = '';
        if(!categorySelection.value && !searchBar.value){
            params['isFeatured'] = true;
            searchText = 'Featured products';
        }
        else{
            params['category'] = categorySelection.value;
            params['name'] = searchBar.value;
            
            searchText = 'Search results';
        }
        const query = createQueryString(params);
        await queryProducts(query);

        dropdownHandler().renderDropdown('header-search-dropdown', renderSearchDropdown(searchText));
    }
    function goToProducts() {
            const params = {
                category: categorySelection.value,
                name: searchBar.value,
            };
            const query = createQueryString(params);
            window.location.href = `/products${query}`;
    }
}

function setCartEvents(){
    const overlay = document.querySelector('.overlay');
    const cartButton = document.querySelector('.js-cart-button');

    cartButton.addEventListener('click', () => {
        const dropdown = document.querySelector('.js-cart-dropdown');
        if(dropdown){
            dropdownHandler().closeDropdown();
        }
        else{
            dropdownHandler().renderDropdown('header-icon-dropdown js-cart-dropdown', renderCartDropdown(), () => {
                const cartButton = document.querySelector('.js-cart-button');
                cartButton.classList.remove('icon-button-active');
            });
            cartButton.classList.add('icon-button-active');
            setProductRemoveButtonEvents();
        }   
        
    });

    function setProductRemoveButtonEvents(){
        const removeButtons = document.querySelectorAll('.js-header-remove-product-button');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const {productId} = btn.dataset;
                await removeFromCart(productId);
                renderHeaderComponent(queryEvent);
                dropdownHandler().renderDropdown('header-icon-dropdown', renderCartDropdown());
                setProductRemoveButtonEvents();
                const cartButton = document.querySelector('.js-cart-button');
                cartButton.classList.add('icon-button-active');
            });
        });
    }
}

function setOrdersEvent(){
    const ordersButton = document.querySelector('.js-orders-button');
    const currentPath = window.location.pathname;
    if(currentPath === '/orders'){
        ordersButton.style.opacity = '0.5';
        ordersButton.style.pointerEvents = 'none';
    }
    else{
        ordersButton.addEventListener('click', () => {
            window.location.href = '/orders';
        });
    }
}

function setProfileEvents(){
    const profileButton = document.querySelector('.js-profile-button');
    
    profileButton.addEventListener('click', () => {
        const dropdown = document.querySelector('.js-profile-dropdown');
        if(dropdown){
            dropdownHandler().closeDropdown();
        }
        else{
            dropdownHandler().renderDropdown('header-icon-dropdown js-profile-dropdown', renderProfileDropdown(), () => {
                const profileButton = document.querySelector('.js-profile-button');
                profileButton.classList.remove('icon-button-active');
            });
            profileButton.classList.add('icon-button-active');
            setLogoutEvent();
        }
    });

    function setLogoutEvent(){
        const logoutButton = document.querySelector('.js-logout-button');
        if(logoutButton){
            logoutButton.addEventListener('click', () => {
                logoutUser({redirect: '/'});
            });
        }
    }
}

function createDropdownHandler(){
    let currentDropdown = null;

    function handleDropdown(){
        return {
            renderDropdown(className, html = '', closingFunc){
                const classes = className.trim().split(' ');

                let dropdown = document.querySelector(`.${className.trim()}`);
                if(dropdown){
                    dropdown.innerHTML = html;
                    currentDropdown.dropdown = dropdown;
                    const overlay = document.querySelector('.overlay');
                    overlay.style.visibility = 'visible';
                    return;
                }

                if(currentDropdown){
                    this.closeDropdown();
                }

                const overlay = document.querySelector('.overlay');
                overlay.style.visibility = 'visible';


                dropdown = document.createElement('div');
                for(const singleClass of classes){
                    dropdown.classList.add(singleClass);
                }
                dropdown.innerHTML = html;
                document.body.appendChild(dropdown);

                const height = dropdown.offsetHeight;
                dropdown.animate([
                    {transform: `translateY(-${height}px)`},
                    {transform: 'translateY(0)'}
                ], {
                    duration: 150,
                    easing: 'ease-in'
                });

                currentDropdown = {
                    dropdown,
                    closingFunc
                };
            },
            async closeDropdown(){
                if(!currentDropdown) return;

                if(currentDropdown.closingFunc){
                    currentDropdown.closingFunc();
                }
                const height = currentDropdown.dropdown.offsetHeight;
                const slideOutAnimation = currentDropdown.dropdown.animate([
                    {transform: 'translateY(0)'},
                    {transform: `translateY(-${height}px)`}
                ], {
                    duration: 150,
                    easing: 'ease-out'
                });

                const overlay = document.querySelector('.overlay');
                overlay.style.visibility = 'hidden';

                const dropdown = currentDropdown.dropdown;
                currentDropdown = null;

                await slideOutAnimation.finished;
                document.body.removeChild(dropdown);
            }
        };
    }

    return handleDropdown;
}

export default renderHeaderComponent;