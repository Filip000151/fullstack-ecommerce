import { queryProducts } from "../../api/products.js";
import { addToCart } from '../../api/cart.js';
import { updateUrlParameters } from "../../utils/query.js";
import renderToast from "../../utils/toast.js";
import { renderProducts, renderElement, renderPagination } from "./template.js";
import renderHeaderComponent from '../header/index.js';

export function renderProductsSectionComponent(){
    renderElement();
    setEvents();
}

function setEvents(){
    renderHeaderComponent(setHeaderEvents);
    setCartButtonEvents();
    setFilterAndSortEvents();
    setPaginationEvents();

    function setHeaderEvents(){
        const searchBar = document.querySelector('.js-search-bar');
        const categorySelection = document.querySelector('.js-category-selection');
        searchBar.addEventListener('keyup', getProducts);
        categorySelection.addEventListener('change', getProducts);
    }
    function setCartButtonEvents(){
        const addButons = document.querySelectorAll('.js-add-to-cart');
        addButons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const {productId:_id, productName:name, productPrice:priceCents, productImage:coverImage} = btn.dataset;
                const quantity = Number(document.querySelector(`.js-quantity-input-${_id}`).value);
                const product = {
                    _id,
                    name,
                    priceCents,
                    coverImage
                };
                await addToCart(product, quantity);
                renderHeaderComponent(setHeaderEvents);
                setHeaderEvents();
            });
        });
    }
    function setFilterAndSortEvents(){
        const sortSelection = document.querySelector('.js-sort-input');
        const filterInputFields = document.querySelectorAll('.js-filter-input');

        sortSelection.addEventListener('change', getProducts);
        filterInputFields.forEach(inputField => inputField.addEventListener('keyup', () => {
            const {filterType} = inputField.dataset;
            if(filterType === 'minPrice'){
                const minPriceText = document.querySelector('.js-min-price-text');
                minPriceText.innerText = `$${Number(inputField.value).toFixed(2)}`;
            }
            if(filterType === 'maxPrice'){
                const maxPriceText = document.querySelector('.js-max-price-text');
                maxPriceText.innerText = inputField.value.length === 0 ? 'Max' : `$${Number(inputField.value).toFixed(2)}`;
            }
            getProducts();
        }));
    }
    function setPaginationEvents(){
        const pageButtons = document.querySelectorAll('.js-pagination-button');
        if(pageButtons && pageButtons.length > 0){
            pageButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const {pageNumber} = btn.dataset;
                    getProducts(pageNumber);
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            });
        }
    }
    async function getProducts(page = 1){
        const category = document.querySelector('.js-category-selection').value;
        const name = document.querySelector('.js-search-bar').value;
        const sort = document.querySelector('.js-sort-input').value;

        const minValue = document.querySelector('.js-min-price-input').value;
        const maxValue = document.querySelector('.js-max-price-input').value;
        const minPrice = minValue.length > 0 ? (Math.round(Number(minValue) * 100)).toString() : '';
        const maxPrice = maxValue.length > 0 ? (Math.round(Number(maxValue) * 100)).toString() : '';

        const queryParams = {
            category,
            name,
            sort,
            minPrice,
            maxPrice
        };

        updateUrlParameters(queryParams);
        queryParams['limit'] = 15;
        queryParams['page'] = page;

        await queryProducts(queryParams);

        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = renderProducts();
        setCartButtonEvents();

        const pageList = document.querySelector('.page-list');
        pageList.innerHTML = renderPagination();
        setPaginationEvents();
    }
}

export default renderProductsSectionComponent;