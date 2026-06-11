import apiClient from './apiClient.js';

import { createQueryString } from '../utils/queryParams.js';

export const products = [];

export async function loadProducts(queryParams){
    const query = createQueryString(queryParams);
        
    const response = await apiClient.get(`/api/products${query}`);
    const data = await response.json();

    if(data.success){
        products.push(...data.products);
    }
    
    return data;
}

export default products;