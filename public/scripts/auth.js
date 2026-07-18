import { auth, loadCurrentUser } from "./api/auth.js";
import apiClient from "./api/apiClient.js";

import renderEmptyHeaderComponent from './components/emptyHeader/index.js';
import renderFooterComponent from './components/footer/index.js';
import renderAuthSectionComponent from "./components/authSection/index.js";
import { showPendingToast } from "./utils/toast.js";
import { renderEmptyHeaderSkeleton } from "./components/emptyHeader/template.js";
import { renderFooterSkeleton } from "./components/footer/template.js";
import { renderAuthSectionSkeleton } from "./components/authSection/template.js";

renderPage();

async function renderPage(){
    apiClient.abortAllRequests();
    showPendingToast();

    renderEmptyHeaderSkeleton();
    renderAuthSectionSkeleton();
    renderFooterSkeleton();

    const pathname = window.location.pathname;
    const isRegister = pathname === '/register';
    
    await loadCurrentUser();

    if(!auth.isGuest && !isRegister){
        window.location.href = '/';
        return;
    }

    renderEmptyHeaderComponent();
    renderFooterComponent();
    renderAuthSectionComponent(isRegister);
}