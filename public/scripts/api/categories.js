import apiClient from './apiClient.js';

export const categories = [];

export async function loadCategories(){
    const data = await apiClient.get('/api/category');

    if(data.success){
        categories.push(...data.categories);
    }

    return data;
}

export async function getCategoryInfo(categoryId){
    const data = await apiClient.get(`/api/category/${categoryId}`);
    return data;
}

export default categories;