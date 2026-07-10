import renderDashboardComponent from "./components/dashboard/index.js";

import { auth, loadCurrentUser } from './api/auth.js';

renderPage();

async function renderPage(){
    await loadCurrentUser();

    if(auth.isGuest || auth.currentUser.role !== 'admin'){
        window.location.href = '/';
        return;
    }

    renderDashboardComponent();
}