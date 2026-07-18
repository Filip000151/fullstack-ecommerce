import { loadCategories } from '../api/categories.js';
import { loadCurrentUser } from '../api/auth.js';
import {products, loadProduct} from '../api/products.js';
import { loadCart } from '../api/cart.js';
import apiClient from "../api/apiClient.js";

import renderHeaderComponent from '../components/header/index.js';
import renderProductComponent from '../components/product/index.js';
import renderFooterComponent from '../components/footer/index.js';
import { renderHeaderSkeleton } from '../components/header/template.js';
import { renderProductSkeleton } from '../components/product/template.js';
import { renderFooterSkeleton } from '../components/footer/template.js';

export default async function renderPage(params){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderHeaderSkeleton();
    renderProductSkeleton();
    renderFooterSkeleton();
    
    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart(),
        loadProduct(params.id)
    ]);

    renderHeaderComponent();
    renderProductComponent();
    renderFooterComponent();
}