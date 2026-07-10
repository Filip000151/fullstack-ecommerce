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

export default shipping;