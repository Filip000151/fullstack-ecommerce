import { loadCategories } from './api/categories.js';
import { loadCurrentUser } from './api/auth.js';
import products from './api/products.js';
import { loadCart } from './api/cart.js';

import renderHeaderComponent from './components/header/index.js';
import renderProductComponent from './components/product/index.js';
import renderFooterComponent from './components/footer/index.js';

renderPage();

async function renderPage(){
    document.title = products.product.name;
    
    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    renderProductComponent();
    renderFooterComponent();
}