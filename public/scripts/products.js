import { categories, loadCategories, getCategoryInfo } from "./api/categories.js";
import {queryProducts} from './api/products.js';

import {getQueryParams, createQueryString} from "./utils/query.js";

import renderHeaderComponent from './components/header/index.js';
import renderFooterComponent from "./components/footer/index.js";
import renderProductsSectionComponent from "./components/productsSection/index.js";

renderPage();

async function renderPage(){
    const queryParams = {
        ...getQueryParams(),
        limit: 9
    };
    const query = createQueryString(queryParams);
    
    await Promise.all([
        loadCategories(),
        queryProducts(query)
    ]);

    renderHeaderComponent();
    renderProductsSectionComponent();
    renderFooterComponent();
}