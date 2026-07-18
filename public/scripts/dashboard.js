import renderDashboardComponent from "./components/dashboard/index.js";

import { auth, loadCurrentUser } from './api/auth.js';
import { renderDashboardSkeleton } from "./components/dashboard/template.js";

renderPage();

async function renderPage(){
    renderDashboardSkeleton();

    await loadCurrentUser();

    if(auth.isGuest || auth.currentUser.role !== 'admin'){
        window.location.href = '/';
        return;
    }

    renderDashboardComponent();
}