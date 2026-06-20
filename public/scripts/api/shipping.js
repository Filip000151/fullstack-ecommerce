import apiClient from './apiClient.js';

export const shipping = {
    shippingOptions: []
};

export async function loadShippingOptions(){
    const response = await apiClient.get('/api/shipping');
    const data = await response.json();
    if(data.success){
        shipping.shippingOptions = data.shippingOptions;
    }
    return data;
}

export default shipping;