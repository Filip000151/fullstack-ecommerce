import {loadShippingOptions} from './api/shipping.js';

import renderCheckoutHeaderComponent from './components/checkoutHeader/index.js';
import renderCheckoutComponent from './components/checkout/index.js';
import renderFooterComponent from './components/footer/index.js';

renderPage();

async function renderPage(){
    await loadShippingOptions();
    
    renderCheckoutHeaderComponent();
    renderCheckoutComponent();
    renderFooterComponent();
}