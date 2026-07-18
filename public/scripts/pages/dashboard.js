import renderDashboardComponent from "../components/dashboard/index.js";

import { auth, loadCurrentUser } from '../api/auth.js';
import { renderDashboardSkeleton } from "../components/dashboard/template.js";

export default async function renderPage(){
    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);
    
    renderDashboardSkeleton();

    await loadCurrentUser();

    if(auth.isGuest || auth.currentUser.role !== 'admin'){
        window.router.navigate('/');
        return;
    }

    renderDashboardComponent();
}