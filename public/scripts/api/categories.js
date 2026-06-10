import apiClient from '../utils/apiClient.js';

export const categories = [];

export async function loadCategories(){
    const response = await apiClient.get('/api/category');
    const data = await response.json();

    if(data.success){
        categories.push(...data.categories);
    }

    return data;
}

export async function getCategoryInfo(categoryId){
    const response = await apiClient.get(`/api/category/${categoryId}`);
    const data = await response.json();

    return data;
}

export default categories;