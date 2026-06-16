import { categories, loadCategories, getCategoryInfo } from "./api/categories.js";

import renderHeaderComponent from "./components/header/index.js";
import renderProductGroupComponent from "./components/productGroup/index.js";
import renderFooterComponent from './components/footer/index.js';

renderPage();

async function renderPage(){
    await loadCategories();
    renderHeaderComponent();

    const displayedCategories = categories.filter(c => c.isDisplayed);
    const categoriesInfoResponse = await Promise.all(
        displayedCategories.map(category => getCategoryInfo(category._id))
    );
    categoriesInfoResponse.forEach(response => {
        if(response.success){
            const categoryInfo = response.category;

            const groupId = categoryInfo._id;
            const title = categoryInfo.name;
            const products = categoryInfo.products;

            renderProductGroupComponent(groupId, title, products);
        }
    });

    renderFooterComponent();
}