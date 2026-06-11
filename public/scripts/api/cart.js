export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function getCartQuantity(){
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    return totalItems;
}

export function addToCart(productId, quantity){
    if(!cart.some(item => item.productId === productId)){
        cart.push({productId, quantity});
    }
    else{
        const item = cart.find(i => i.productId === productId);
        item.quantity += quantity;
    }
    saveToStorage();
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export default cart;