import { categories, loadCategories, getCategoryInfo } from "./api/categories.js";

import renderHeader from "./components/header.js";
import renderProductGroup from "./components/productGroup.js";

async function renderPage(){
    await loadCategories();
    renderHeader();

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

            renderProductGroup(groupId, title, products);
        }
    });
        
}

renderPage();