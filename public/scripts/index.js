import { categories, loadCategories, queryCategories } from "./api/categories.js";
import { showPendingToast } from "./utils/toast.js";
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';

import renderHeaderComponent from "./components/header/index.js";
import renderProductGroupComponent from "./components/productGroup/index.js";
import renderFooterComponent from './components/footer/index.js';

renderPage();

async function renderPage(){
    showPendingToast();

    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart()
    ]);

    renderHeaderComponent();
    
    const querriedCategories = await queryCategories({isDisplayed: true, withProducts: true});
    querriedCategories.forEach(category => {
        renderProductGroupComponent(category._id, category.name, category.products);
    });

    renderFooterComponent();
}