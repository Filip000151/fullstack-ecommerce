import { loadUserOrders } from "./api/orders.js";
import {loadCategories} from './api/categories.js';
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';
import apiClient from "./api/apiClient.js";

import { showPendingToast } from "./utils/toast.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderOrdersComponent from "./components/orders/index.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    showPendingToast();
    
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