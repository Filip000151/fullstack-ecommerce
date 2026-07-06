import { loadCategories } from './api/categories.js';
import { loadOrder } from './api/orders.js';
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderTrackOrderComponent from './components/trackOrder/index.js';

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    const orderId = window.location.pathname.split('/')[2];
    
    await loadCurrentUser();
    await Promise.all([
        loadOrder(orderId),
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    renderFooterComponent();
    renderTrackOrderComponent();
}