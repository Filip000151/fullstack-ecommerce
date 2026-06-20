export function validateCheckoutInputs(){
    const emailValue = document.querySelector('.js-email-input').value.trim();
    const addressValue = document.querySelector('.js-address-input').value.trim();

    const emailError = document.querySelector('.js-email-error');
    const addressError = document.querySelector('.js-address-error');

    let emailErrorMsg = '';
    let addressErrorMsg = '';
    let success = true;

    if(emailValue.length === 0){
        emailErrorMsg = 'Please enter your email address. ';
        success = false;
    }
    else if(!isValidEmail()){
        emailErrorMsg = 'Please enter a valid email address (e.g., name@example.com). ';
        success = false;
    }

    if(addressValue.length === 0){
        addressErrorMsg = 'Please enter your delivery address. ';
        success = false;
    }
    else if(addressValue.length < 5){
        addressErrorMsg = 'Address must be at least 5 characters long. ';
        success = false;
    }

    emailError.innerText = emailErrorMsg;
    addressError.innerText = addressErrorMsg;

    return success;

    function isValidEmail(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    }
}

export default validateCheckoutInputs;