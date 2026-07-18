import { loadCategories, queryCategories } from "../api/categories.js";
import { loadCurrentUser } from "../api/auth.js";
import { loadCart } from '../api/cart.js';
import { queryProducts } from "../api/products.js";
import apiClient from "../api/apiClient.js";

import renderHeaderComponent from "../components/header/index.js";
import { renderHeaderSkeleton } from "../components/header/template.js";
import renderProductGroupComponent from "../components/productGroup/index.js";
import { renderProductGroupSkeleton } from "../components/productGroup/template.js";
import renderFooterComponent from '../components/footer/index.js';
import renderFeaturedSectionComponent from "../components/featuredSection/index.js";
import { renderFeaturedSectionSkeleton } from "../components/featuredSection/template.js";
import { renderFooterSkeleton } from "../components/footer/template.js";

export default async function renderPage(){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderHeaderSkeleton();
    renderFeaturedSectionSkeleton();
    const groupSkeleton = renderProductGroupSkeleton();
    const groupSkeleton2 = renderProductGroupSkeleton();
    renderFooterSkeleton();

    await loadCurrentUser();
    await Promise.all([
        loadCategories(),
        loadCart(),
        queryProducts({isFeatured: true})
    ]);

    groupSkeleton.remove();
    groupSkeleton2.remove();

    renderHeaderComponent();
    renderFeaturedSectionComponent();
    const querriedCategories = await queryCategories({isDisplayed: true, withProducts: true});
    querriedCategories.forEach(category => {
        renderProductGroupComponent(category._id, category.name, category.products);
    });
    renderFooterComponent();
}