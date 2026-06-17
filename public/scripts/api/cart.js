export const cart = {
    guestCart: JSON.parse(localStorage.getItem('cart')) || []
};

export function getCartQuantity(){
    let totalItems = 0;
    cart.guestCart.forEach(item => {
        totalItems += item.quantity;
    });
    return totalItems;
}

export function addToCart(product, quantity){
    if(!cart.guestCart.some(item => item.product.productId === product.productId)){
        cart.guestCart.push({product, quantity});
    }
    else{
        const item = cart.guestCart.find(i => i.product.productId === product.productId);
        item.quantity += quantity;
    }
    saveToStorage();
}

export function removeFromCart(productId){
    cart.guestCart = cart.guestCart.filter(item => item.product.productId !== productId);
    saveToStorage();
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart.guestCart));
}

export default cart;