import createQueryString from "../../utils/query.js";
import renderToast from "../../utils/toast.js";
import debounce from "../../utils/debounce.js";
import renderPageSpinner from '../../utils/spinner.js';
import {renderElement, renderCartDropdown, renderSearchDropdown, renderProfileDropdown, renderSearchDropdownSkeleton} from "./template.js";
import { removeFromCart } from "../../api/cart.js";
import { queryProducts } from "../../api/products.js";
import { logoutUser } from "../../api/auth.js";
import apiClient from "../../api/apiClient.js";

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

    searchBar.addEventListener('focus', () => {
        const dropdown = document.querySelector('.header-search-dropdown');
        if(dropdown) return;
        
        querySearchProducts();
    });
    categorySelection.addEventListener('change', querySearchProducts);

    searchButton.addEventListener('click', goToProducts);
    const debouncedSearch = debounce(querySearchProducts, 500);
    searchBar.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            goToProducts();
            return;
        }
        debouncedSearch();
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

        dropdownHandler().renderDropdown('header-search-dropdown', {
            asyncFunc: async () => {
                await queryProducts(params);
                return renderSearchDropdown(searchText);   
            },
            loadingHtml: renderSearchDropdownSkeleton()
        });
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
            dropdownHandler().renderDropdown('header-icon-dropdown js-cart-dropdown', {
                html: renderCartDropdown(), 
                closingFunc: () => {
                    const cartButton = document.querySelector('.js-cart-button');
                    cartButton.classList.remove('icon-button-active');
                }
            });
            cartButton.classList.add('icon-button-active');
            setProductRemoveButtonEvents();
        }   
        
    });

    function setProductRemoveButtonEvents(){
        const removeButtons = document.querySelectorAll('.js-header-remove-product-button');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const spinner = renderPageSpinner();
                const {productId} = btn.dataset;
                await removeFromCart(productId);
                spinner.remove();
                renderHeaderComponent(queryEvent);
                dropdownHandler().renderDropdown('header-icon-dropdown', {html: renderCartDropdown()});
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
            dropdownHandler().renderDropdown('header-icon-dropdown js-profile-dropdown', {
                html: renderProfileDropdown(),
                closingFunc: () => {
                    const profileButton = document.querySelector('.js-profile-button');
                    profileButton.classList.remove('icon-button-active');
                }
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
            async renderDropdown(className, options = {html: '', closingFunc: undefined, asyncFunc: undefined, loadingHtml: ''}){
                const classes = className.trim().split(' ');

                let dropdown = document.querySelector(`.${className.trim()}`);
                if(dropdown){
                    currentDropdown.dropdown = dropdown;
                    const overlay = document.querySelector('.overlay');
                    overlay.style.visibility = 'visible';
                    if(currentDropdown.options.asyncFunc){
                        dropdown.innerHTML = options.loadingHtml;
                        const html = await options.asyncFunc();
                        dropdown.innerHTML = html;
                        return;
                    }
                    dropdown.innerHTML = options.html;
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

                currentDropdown = {
                    dropdown,
                    options
                };

                if(options.asyncFunc){
                    dropdown.innerHTML = options.loadingHtml;
                }
                else{
                    dropdown.innerHTML = options.html;
                }
                
                document.body.appendChild(dropdown);

                const height = dropdown.offsetHeight;
                dropdown.animate([
                    {transform: `translateY(-${height}px)`},
                    {transform: 'translateY(0)'}
                ], {
                    duration: 150,
                    easing: 'ease-in'
                });

                if(options.asyncFunc){
                    const html = await options.asyncFunc();
                    dropdown.innerHTML = html;
                }
            },
            async closeDropdown(){
                if(!currentDropdown) return;
                if(currentDropdown.options.asyncFunc){
                    apiClient.abortAllRequests();
                }
                if(currentDropdown.options.closingFunc){
                    currentDropdown.options.closingFunc();
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