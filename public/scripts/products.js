import { categories, loadCategories, getCategoryInfo } from "./api/categories.js";
import {products, loadProducts} from './api/products.js';
import {cart} from './api/cart.js';

import getQueryParams from "./utils/queryParams.js";

import renderHeader from "./components/header.js";
import renderFooter from "./components/footer.js";
import renderProductsSection from "./components/productsSection.js";

renderPage();

async function renderPage(){
    const queryParams = getQueryParams();
    
    await Promise.all([
        loadCategories(),
        loadProducts(queryParams)
    ]);

    renderHeader(queryParams);
    renderProductsSection();
    renderFooter();
}