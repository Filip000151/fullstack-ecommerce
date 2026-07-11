import apiClient from './apiClient.js';
import createQueryString from '../utils/query.js';
import renderToast from '../utils/toast.js';

export const categories = {
    list: [],
    current: null
};

export async function loadCategories(){
    const data = await apiClient.get(`/api/category`);

    if(data.success){
        categories.list = data.categories;
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

export async function getCategoryInfo(categoryId, withProducts = true){
    const query = createQueryString({withProducts});
    const data = await apiClient.get(`/api/category/${categoryId}${query}`);
    if(data.success){
        categories.current = data.category;
    }
    return data;
}

export async function createCategory(body, redirect){
    const data = await apiClient.post('/api/category', body);

    if(data.success){
        renderToast(data.msg, {redirect: redirect.redirect});
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export async function deleteCategory(categoryId, redirect){
    const data = await apiClient.delete(`/api/category/${categoryId}`);

    if(data.success){
        renderToast(data.msg, {redirect: redirect.redirect});
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export async function updateCategory(categoryId, body){
    const data = await apiClient.patch(`/api/category/${categoryId}`, body);

    if(data.success){
        categories.current = data.category;
        renderToast(data.msg);
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export default categories;