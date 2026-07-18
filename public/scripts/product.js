import { loadCategories } from './api/categories.js';
import { loadCurrentUser } from './api/auth.js';
import products from './api/products.js';
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import renderHeaderComponent from './components/header/index.js';
import renderProductComponent from './components/product/index.js';
import renderFooterComponent from './components/footer/index.js';
import { renderHeaderSkeleton } from './components/header/template.js';
import { renderProductSkeleton } from './components/product/template.js';
import { renderFooterSkeleton } from './components/footer/template.js';

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();

    renderHeaderSkeleton();
    renderProductSkeleton();
    renderFooterSkeleton();

    document.title = products.current.name;
    
    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    renderProductComponent();
    renderFooterComponent();
}