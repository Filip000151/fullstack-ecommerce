import { loadCategories } from '../api/categories.js';
import { loadOrder } from '../api/orders.js';
import { loadCurrentUser } from "../api/auth.js";
import { loadCart } from '../api/cart.js';
import apiClient from "../api/apiClient.js";

import renderHeaderComponent from '../components/header/index.js';
import renderFooterComponent from '../components/footer/index.js';
import renderTrackOrderComponent from '../components/trackOrder/index.js';
import { renderHeaderSkeleton } from '../components/header/template.js';
import { renderTrackOrderSkeleton } from '../components/trackOrder/template.js';
import { renderFooterSkeleton } from '../components/footer/template.js';

export default async function renderPage(params){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderHeaderSkeleton();
    renderTrackOrderSkeleton();
    renderFooterSkeleton();
    
    await loadCurrentUser();
    await Promise.all([
        loadOrder(params.id),
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    renderFooterComponent();
    renderTrackOrderComponent();
}