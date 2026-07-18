import { loadUserOrders } from "../api/orders.js";
import {loadCategories} from '../api/categories.js';
import { loadCurrentUser } from "../api/auth.js";
import { loadCart } from '../api/cart.js';
import apiClient from "../api/apiClient.js";

import renderHeaderComponent from '../components/header/index.js';
import renderFooterComponent from '../components/footer/index.js';
import renderOrdersComponent from "../components/orders/index.js";
import { renderHeaderSkeleton } from "../components/header/template.js";
import { renderFooterSkeleton } from "../components/footer/template.js";
import { renderOrdersSkeleton } from "../components/orders/template.js";

export default async function renderPage(){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderHeaderSkeleton();
    renderOrdersSkeleton();
    renderFooterSkeleton();
    
    await loadCurrentUser();
    await Promise.all([
        loadUserOrders(),
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    renderOrdersComponent();
    renderFooterComponent();
}