import { auth, loadCurrentUser } from "../api/auth.js";
import apiClient from "../api/apiClient.js";

import renderEmptyHeaderComponent from '../components/emptyHeader/index.js';
import renderFooterComponent from '../components/footer/index.js';
import renderAuthSectionComponent from "../components/authSection/index.js";
import { renderEmptyHeaderSkeleton } from "../components/emptyHeader/template.js";
import { renderFooterSkeleton } from "../components/footer/template.js";
import { renderAuthSectionSkeleton } from "../components/authSection/template.js";

export default async function renderPage(){
    apiClient.abortAllRequests();

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderEmptyHeaderSkeleton();
    renderAuthSectionSkeleton();
    renderFooterSkeleton();

    const pathname = window.location.pathname;
    const isRegister = pathname === '/register';
    
    await loadCurrentUser();

    if(!auth.isGuest && !isRegister){
        window.router.navigate('/');
        return;
    }

    renderEmptyHeaderComponent();
    renderFooterComponent();
    renderAuthSectionComponent(isRegister);
}