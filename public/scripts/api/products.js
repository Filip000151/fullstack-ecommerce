import renderToast from '../utils/toast.js';
import apiClient from './apiClient.js';

export const products = {
    list: [],
    pagination: {},
    current: window.__PRODUCT_DATA__ ? window.__PRODUCT_DATA__ : null
};

export async function queryProducts(query = ''){
    const data = await apiClient.get(`/api/products${query}`);

    if(data.success){
        products.list = data.products;
        products.pagination = data.pagination;
    }
    
    return data;
}

export async function loadProduct(productId){
    const data = await apiClient.get(`/api/products/${productId}`);

    if(data.success){
        products.current = data.product;
    }

    return data;
}

export async function createProduct(body){
    const data = await apiClient.post(`/api/products`, body);

    if(data.success){
        renderToast(data.msg);
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export async function updateProduct(productId, body){
    const data = await apiClient.patch(`/api/products/${productId}`, body);

    if(data.success){
        renderToast(data.msg);
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export async function deleteProduct(productId){
    const data = await apiClient.delete(`/api/products/${productId}`);

    if(data.success){
        renderToast(data.msg);
    }
    else{
        renderToast(data.msg, {success: false});
    }
    
    return data;
}

export default products;