import { loadCategories, queryCategories } from "./api/categories.js";
import { showPendingToast } from "./utils/toast.js";
import { loadCurrentUser } from "./api/auth.js";
import { loadCart } from './api/cart.js';
import { queryProducts } from "./api/products.js";
import apiClient from "./api/apiClient.js";

import renderHeaderComponent from "./components/header/index.js";
import renderProductGroupComponent from "./components/productGroup/index.js";
import renderFooterComponent from './components/footer/index.js';
import renderFeaturedSectionComponent from "./components/featuredSection/index.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    showPendingToast();

    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart(),
        queryProducts({isFeatured: true})
    ]);

    renderHeaderComponent();
    renderFeaturedSectionComponent();
    const querriedCategories = await queryCategories({isDisplayed: true, withProducts: true});
    querriedCategories.forEach(category => {
        renderProductGroupComponent(category._id, category.name, category.products);
    });

    renderFooterComponent();
}