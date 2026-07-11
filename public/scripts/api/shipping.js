import renderToast from '../utils/toast.js';
import apiClient from './apiClient.js';

export const shipping = {
    list: [],
    current: null
};

export async function loadShippingOptions(){
    const data = await apiClient.get('/api/shipping');
    if(data.success){
        shipping.list = data.shippingOptions;
    }
    return data;
}

export async function loadShippingOption(shippingId){
    const data = await apiClient.get(`/api/shipping/${shippingId}`);

    if(data.success){
        shipping.current = data.shippingOption;
    }

    return data;
}

export async function createShippingOption(body, redirect){
    const data = await apiClient.post(`/api/shipping`, body);

    if(data.success){
        shipping.list.push(data.shippingOption);
        renderToast(data.msg, {redirect: redirect.redirect});
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export async function deleteShippingOption(shippingId, redirect){
    const data = await apiClient.delete(`/api/shipping/${shippingId}`);

    if(data.success){
        renderToast(data.msg, {redirect: redirect.redirect});
    }
    else{
        renderToast(data.msg, {success: false});
    }
}

export async function updateShippingOption(shippingId, body){
    const data = await apiClient.patch(`/api/shipping/${shippingId}`, body);

    if(data.success){
        shipping.current = data.shippingOption;
        renderToast(data.msg);
    }
    else{
        renderToast(data.msg, {success: false});
    }

    return data;
}

export default shipping;