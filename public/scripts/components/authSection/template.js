import { renderElementSpinner } from "../../utils/spinner.js";
import auth from '../../api/auth.js';

export function createElement(isRegister){
    let html = '';

    if(isRegister) html = renderRegister();
    else html = renderLogin();

    let authSection = document.querySelector('.auth-section');
    if(authSection){
        authSection.innerHTML = html;
    }
    else{
        authSection = document.createElement('section');
        authSection.classList.add('auth-section');
        authSection.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(authSection);
    }
        

    function renderLogin(){
        const html = `
            <h4>Login</h4>
            <div class="auth-input-section">
                <label for="">Email address</label>
                <input type="email" class="auth-input js-email-input">
                <span class="auth-error-validation js-email-error"></span>
            </div>
            <div class="auth-input-section">
                <label for="">Password</label>
                <input type="password" class="auth-input js-password-input">
                <span class="auth-error-validation js-password-error"></span>
            </div>

            <div class="auth-lower-section">
                <div class="auth-remember-me remember-me-not-active js-remember-me">
                    <p>Remember me</p>
                    <svg class="checkbox-icon" viewBox="0 0 22 22" width="18" height="18">
                        <rect x="3" y="3" width="18" height="18" 
                            stroke-width="2" fill="none" rx="3"/>
                        <path d="M7 12l4 4 6-8" 
                            stroke-width="2" fill="none" 
                            stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <button class="auth-button js-login-button">Log in</button>
                <p>Don't have an account? <a href="/register" data-navigate>Register here</a></p>
            </div>
        `;

        return html;
    }
    function renderRegister(){
        const html = `
            <h4>Register</h4>
            <div class="auth-input-section">
                <label for="">Name</label>
                <input type="text" class="auth-input js-name-input">
                <span class="auth-error-validation js-name-error"></span>
            </div>
            <div class="auth-input-section">
                <label for="">Email address</label>
                <input type="email" class="auth-input js-email-input">
                <span class="auth-error-validation js-email-error"></span>
            </div>
            <div class="auth-input-section">
                <label for="">Password</label>
                <input type="password" class="auth-input js-password-input">
                <span class="auth-error-validation js-password-error"></span>
            </div>
            <div class="auth-input-section">
                <label for="">Confirm password</label>
                <input type="password" class="auth-input js-confirm-password-input">
                <span class="auth-error-validation js-confirm-password-error"></span>
            </div>
            ${auth.currentUser && auth.currentUser.role === 'admin' ? `
            <div class="auth-input-section">
                <label for="">Make user admin?</label>
                <input type="checkbox" class="auth-input js-admin-input">
            </div>    
            ` : ''}

            <div class="auth-lower-section">
                <button class="auth-button js-register-button">Register</button>
                <p>Already have an account? <a href="/login" data-navigate>Log in here</a></p>
            </div>
        `;
        return html;
    }
}

export function renderAuthSectionSkeleton(){
    const authSectionSkeleton = document.createElement('section');
    authSectionSkeleton.classList.add('auth-section');
    const html = `
        <div style="display: flex; justify-content: center;">
            <div class="skeleton" style="width: 100px; height: 30px;"></div>
        </div>
        <div style="height: 360px; width: 280px; position: relative;"></div>
    `;
    authSectionSkeleton.innerHTML = html;
    renderElementSpinner(authSectionSkeleton.children[1]);
    const container = document.querySelector('.container');
    container.appendChild(authSectionSkeleton);
    return authSectionSkeleton;
}

export default createElement;