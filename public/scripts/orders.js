import { loadUserOrders } from "./api/orders.js";
import {loadCategories} from './api/categories.js';

import { showPendingToast } from "./utils/toast.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderOrdersComponent from "./components/orders/index.js";

renderPage();

async function renderPage(){
    showPendingToast();
    
    await Promise.all([
        loadUserOrders(),
        loadCategories()
    ]);

    renderHeaderComponent();
    renderOrdersComponent();
    renderFooterComponent();
}