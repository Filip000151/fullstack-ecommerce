import auth from "../../api/auth.js";

export function validateCheckoutInputs(){
    const deliveryAddressValidated = validateDeliveryAddress();
    if(auth.isGuest){
        const guestEmailValidated = validateGuestEmailAddress();
        return deliveryAddressValidated && guestEmailValidated;
    }
    return deliveryAddressValidated;
}

function validateDeliveryAddress(){
    const addressValue = document.querySelector('.js-address-input').value.trim();
    const addressError = document.querySelector('.js-address-error');

    if(addressValue.length === 0){
        addressError.innerText = 'Please enter your delivery address.';
        return false;
    }
    if(addressValue.length < 5){
        addressError.innerText = 'Address must be at least 5 characters long.';
        return false;
    }
    return true;
}

function validateGuestEmailAddress(){
    const emailValue = document.querySelector('.js-email-input').value.trim();
    const emailError = document.querySelector('.js-email-error');

    if(emailValue.length === 0){
        emailError.innerText = 'Please enter your email address.';
        return false;
    }  
    if(!isValidEmail()){
        emailError.innerText = 'Please enter a valid email address (e.g., name@example.com).';
        return false;
    } 
    return true;

    function isValidEmail(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    }
}

export default validateCheckoutInputs;