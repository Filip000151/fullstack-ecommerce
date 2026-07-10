import { loadCategories, getCategoryInfo } from "./api/categories.js";
import {queryProducts} from './api/products.js';
import { loadCurrentUser } from './api/auth.js';
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import {getQueryParams, createQueryString} from "./utils/query.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from "./components/footer/index.js";
import renderProductsSectionComponent from "./components/productsSection/index.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    
    const queryParams = {
        ...getQueryParams(),
        limit: 9
    };
    const query = createQueryString(queryParams);
    
    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        queryProducts(query),
        loadCart()
    ]);

    renderHeaderComponent();
    renderProductsSectionComponent();
    renderFooterComponent();
}