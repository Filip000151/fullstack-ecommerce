import apiClient from './apiClient.js';

export const shipping = {
    shippingOptions: []
};

export async function loadShippingOptions(){
    const data = await apiClient.get('/api/shipping');
    if(data.success){
        shipping.shippingOptions = data.shippingOptions;
    }
    return data;
}

export default shipping;