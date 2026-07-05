export function validateAuthInputs(isRegister = false){
    const emailValidated = validateEmailAddress();
    if(isRegister){
        const passwordValidated = validatePassword();
        const nameValidated = validateName();

        return emailValidated && passwordValidated && nameValidated;
    }

    return emailValidated;
}

function validateEmailAddress(){
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

function validatePassword(){
    const passwordValue = document.querySelector('.js-password-input').value;
    const confirmPasswordValue = document.querySelector('.js-confirm-password-input').value;

    const passwordError = document.querySelector('.js-password-error');
    const confirmPasswordError = document.querySelector('.js-confirm-password-error');

    if(passwordValue.length < 6){
        passwordError.innerText = 'Password must have at least 6 characters!';
        return false;
    }
    if(passwordValue !== confirmPasswordValue){
        confirmPasswordError.innerText = 'Passwords do not match!';
        return false;
    }
    return true;
}

function validateName(){
    const nameValue = document.querySelector('.js-name-input').value.trim();
    const nameError = document.querySelector('.js-name-error');

    if(nameValue.length === 0){
        nameError.innerText = 'Name is required!';
        return false;
    }
    return true;
}

export default validateAuthInputs;