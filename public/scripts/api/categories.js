import apiClient from './apiClient.js';
import createQueryString from '../utils/query.js';

export const categories = {
    categories: [],
    category: null
};

export async function loadCategories(){
    const data = await apiClient.get(`/api/category`);

    if(data.success){
        categories.categories = data.categories;
    }

    return data;
}

export async function queryCategories(queryParams = {}){
    const query = createQueryString(queryParams);
    const data = await apiClient.get(`/api/category${query}`);

    if(data.success){
        return data.categories;
    }

    return [];
}

export async function getCategoryInfo(categoryId, withProducts = false){
    const query = createQueryString({withProducts});
    const data = await apiClient.get(`/api/category/${categoryId}${query}`);
    if(data.success){
        categories.category = data.category;
    }
    return data;
}

export default categories;