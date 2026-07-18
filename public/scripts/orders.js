import { loadUserOrders } from "./api/orders.js";
import {loadCategories} from './api/categories.js';
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import { showPendingToast } from "./utils/toast.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderOrdersComponent from "./components/orders/index.js";
import { renderHeaderSkeleton } from "./components/header/template.js";
import { renderFooterSkeleton } from "./components/footer/template.js";
import { renderOrdersSkeleton } from "./components/orders/template.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    showPendingToast();

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