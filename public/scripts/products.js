import { loadCategories, getCategoryInfo } from "./api/categories.js";
import {queryProducts} from './api/products.js';
import { loadCurrentUser } from './api/auth.js';
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import {getQueryParams} from "./utils/query.js";

import renderHeaderComponent from './components/header/index.js';
import { renderHeaderSkeleton } from "./components/header/template.js";
import renderFooterComponent from "./components/footer/index.js";
import renderProductsSectionComponent from "./components/productsSection/index.js";
import { renderProductSectionSkeleton } from "./components/productsSection/template.js";
import { renderFooterSkeleton } from "./components/footer/template.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();

    renderHeaderSkeleton();
    renderProductSectionSkeleton();
    renderFooterSkeleton();
    
    const queryParams = {
        ...getQueryParams(),
        limit: 15
    };
    
    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        queryProducts(queryParams),
        loadCart()
    ]);

    renderHeaderComponent();
    renderProductsSectionComponent();
    renderFooterComponent();
}