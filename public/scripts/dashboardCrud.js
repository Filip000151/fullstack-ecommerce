import { auth, loadCurrentUser } from "./api/auth.js";
import renderDashboardItemsComponent from "./components/dashboardItems/index.js";
import { renderDashboardItemsSkeleton } from "./components/dashboardItems/template.js";
import { showPendingToast } from "./utils/toast.js";

renderPage();

async function renderPage(){
    showPendingToast();

    renderDashboardItemsSkeleton();

    await loadCurrentUser();

    if(auth.isGuest || auth.currentUser.role !== 'admin'){
        window.location.href = '/';
        return;
    }

    const loader = {
        orders: async () => {
            const {loadUserOrders} = await import('./api/orders.js');
            await loadUserOrders();
        },
        products: async () => {
            const {queryProducts} = await import('./api/products.js');
            const {loadCategories} = await import('./api/categories.js');
            await Promise.all([
                loadCategories(),
                queryProducts({limit: 15})
            ]);
        },
        categories: async () => {
            const {loadCategories} = await import('./api/categories.js');
            await loadCategories();
        },
        shipping: async () => {
            const {loadShippingOptions} = await import('./api/shipping.js');
            await loadShippingOptions();
        }
    };

    const pathname = window.location.pathname.split('/')[2];
    await loader[pathname]();

    await renderDashboardItemsComponent(pathname);
}