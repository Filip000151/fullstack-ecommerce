import {loadShippingOptions} from '../api/shipping.js';
import { loadCurrentUser } from "../api/auth.js";
import { loadCart } from '../api/cart.js';
import apiClient from "../api/apiClient.js";

import renderEmptyHeaderComponent from '../components/emptyHeader/index.js';
import renderCheckoutComponent from '../components/checkout/index.js';
import renderFooterComponent from '../components/footer/index.js';
import { renderEmptyHeaderSkeleton } from '../components/emptyHeader/template.js';
import { renderCheckoutSkeleton } from '../components/checkout/template.js';
import { renderFooterSkeleton } from '../components/footer/template.js';

export default async function renderPage(){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderEmptyHeaderSkeleton();
    renderCheckoutSkeleton();
    renderFooterSkeleton();

    await loadCurrentUser();
    await Promise.all([
        loadShippingOptions(),
        loadCart()
    ]);
    
    renderEmptyHeaderComponent();
    renderCheckoutComponent();
    renderFooterComponent();
}