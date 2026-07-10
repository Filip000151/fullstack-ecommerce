import { auth, loadCurrentUser } from "./api/auth.js";
import renderDashboardItemsComponent from "./components/dashboardItems/index.js";

renderPage();

async function renderPage(){
    await loadCurrentUser();

    if(auth.isGuest || auth.currentUser.role !== 'admin'){
        window.location.href = '/';
        return;
    }

    const pathname = window.location.pathname.split('/')[2];
    switch(pathname){
        case 'orders':
            const {loadUserOrders} = await import('./api/orders.js');
            await loadUserOrders();
            break;
        case 'products':
            const {queryProducts} = await import('./api/products.js');
            await queryProducts();
            break;
        case 'categories':
            const {loadCategories} = await import('./api/categories.js');
            await loadCategories();
            break;
        case 'shipping':
            const {loadShippingOptions} = await import('./api/shipping.js');
            await loadShippingOptions();
            break;
    }

    await renderDashboardItemsComponent(pathname);
}