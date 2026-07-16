import createElement from "./template.js";
import validateAuthInputs from "./validate.js";

import { auth, registerUser, loginUser } from "../../api/auth.js";
import renderSpinner from "../../utils/spinner.js";

export function renderAuthSectionComponent(isRegister = false){
    createElement(isRegister);
    
    if(isRegister) setRegisterEvents();
    else setLoginEvents();
}

function setLoginEvents(){
    const rememberMeButton = document.querySelector('.js-remember-me');
    const loginButton = document.querySelector('.js-login-button');
    const inputs = document.querySelectorAll('.auth-input');

    rememberMeButton.addEventListener('click', () => {
        if(rememberMeButton.classList.contains('remember-me-not-active')){
            rememberMeButton.classList.remove('remember-me-not-active');
            rememberMeButton.classList.add('remember-me-active');
        }
        else{
            rememberMeButton.classList.remove('remember-me-active');
            rememberMeButton.classList.add('remember-me-not-active');
        }
    });

    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') setLoginEvent();
        });
    });
    loginButton.addEventListener('click', setLoginEvent);


    async function setLoginEvent(){
        if(!validateAuthInputs()) return;
        const spinner = renderSpinner(document.body);
        
        const email = document.querySelector('.js-email-input').value;
        const password = document.querySelector('.js-password-input').value;
        const rememberMe = rememberMeButton.classList.contains('remember-me-not-active') ? false : true;

        await loginUser({email, password, rememberMe}, {redirect: '/'});
        spinner.remove();
    }
}
function setRegisterEvents(){
    const registerButton = document.querySelector('.js-register-button');
    const inputs = document.querySelectorAll('auth-input');

    registerButton.addEventListener('click', setRegisterEvent);
    inputs.forEach(input => {
        input.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') setRegisterEvent();
        });
    });

    async function setRegisterEvent(){
        const isRegister = true;
        if(!validateAuthInputs(isRegister)) return;

        const spinner = renderSpinner(document.body);

        const name = document.querySelector('.js-name-input').value;
        const email = document.querySelector('.js-email-input').value;
        const password = document.querySelector('.js-password-input').value;
        const confirmPassword = document.querySelector('.js-confirm-password-input').value;

        const redirect = auth.isGuest ? '/login' : '/';

        await registerUser(
            {name, email, password, confirmPassword},
            {redirect}
        );

        spinner.remove();
    }
}

export default renderAuthSectionComponent;