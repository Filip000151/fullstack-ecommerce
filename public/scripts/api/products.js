import apiClient from './apiClient.js';

export const products = {
    querriedProducts: [],
    pagination: {},
    product: window.__PRODUCT_DATA__ ? window.__PRODUCT_DATA__ : null
};

export async function queryProducts(query){
    const response = await apiClient.get(`/api/products${query}`);
    const data = await response.json();

    if(data.success){
        products.querriedProducts = data.products;
        products.pagination = data.pagination;
    }
    
    return data;
}

export default products;