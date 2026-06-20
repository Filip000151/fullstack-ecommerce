export function createElement(){
    const html = `
        <a href="/">
            <img src="images/logo.png">
        </a>
    `;
    let checkoutHeader = document.querySelector('.checkout-header');
    if(checkoutHeader){
        checkoutHeader.innerHTML = html;
    }
    else{
        checkoutHeader = document.createElement('header');
        checkoutHeader.classList.add('checkout-header');
        checkoutHeader.innerHTML = html;
        document.body.appendChild(checkoutHeader);
    }
}

export default createElement;