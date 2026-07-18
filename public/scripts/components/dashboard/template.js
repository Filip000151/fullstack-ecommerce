import {renderElementSpinner} from '../../utils/spinner.js';

export function createElement(){
    const html = `
        <a href="/"><img src="images/logo.png" alt=""></a>
        <div class="dashboard-links">
            <a href="/dashboard/orders"><button class="dashboard-button">Orders</button></a>
            <a href="/dashboard/products"><button class="dashboard-button">Products</button></a>
            <a href="/dashboard/categories"><button class="dashboard-button">Categories</button></a>
            <a href="/dashboard/shipping"><button class="dashboard-button">Shipping options</button></a>
        </div>
    `;

    let dashboard = document.querySelector('.dashboard');
    if(dashboard){
        dashboard.innerHTML = html;
    }
    else{
        dashboard = document.createElement('div')
        dashboard.classList.add('dashboard');
        dashboard.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(dashboard);
    }
}

export function renderDashboardSkeleton(){
    const dashboardSkeleton = document.createElement('div');
    dashboardSkeleton.classList.add('dashboard');
    const html = `
        <div style="position: relative; width: 100%; height: 100%;"></div>
    `;
    dashboardSkeleton.innerHTML = html;
    renderElementSpinner(dashboardSkeleton.children[0]);
    const container = document.querySelector('.container');
    container.appendChild(dashboardSkeleton);
    return dashboardSkeleton;
}

export default createElement;