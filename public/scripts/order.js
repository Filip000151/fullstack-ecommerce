import { loadCategories } from './api/categories.js';
import { loadOrder } from './api/orders.js';

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderTrackOrderComponent from './components/trackOrder/index.js';

renderPage();

async function renderPage(){
    const orderId = window.location.pathname.split('/')[2];
    
    await Promise.all([
        loadOrder(orderId),
        loadCategories()
    ]);

    renderHeaderComponent();
    renderFooterComponent();
    renderTrackOrderComponent();
}