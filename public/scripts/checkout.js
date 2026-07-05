import {loadShippingOptions} from './api/shipping.js';
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';

import renderEmptyHeaderComponent from './components/emptyHeader/index.js';
import renderCheckoutComponent from './components/checkout/index.js';
import renderFooterComponent from './components/footer/index.js';

renderPage();

async function renderPage(){
    await loadCurrentUser();
    await Promise.all([
        loadShippingOptions(),
        loadCart()
    ]);
    
    renderEmptyHeaderComponent();
    renderCheckoutComponent();
    renderFooterComponent();
}