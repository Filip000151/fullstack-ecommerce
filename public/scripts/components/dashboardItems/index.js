import {createElement, renderItemWindow} from "./template.js";

let itemController;

export async function renderDashboardItemsComponent(dataType){
    await createElement(dataType);
    await importCrudOperations(dataType);
    setItemWindowEvent();
}

async function importCrudOperations(dataType){
    switch(dataType){
        case 'orders':
            const {loadOrder, cancelOrder} = await import('../../api/orders.js');
            itemController = {
                create: null,
                read: loadOrder,
                update: null,
                delete: cancelOrder
            }
            return;
        case 'products':
            const {loadProduct, createProduct, updateProduct, deleteProduct} = await import('../../api/products.js');
            itemController = {
                create: createProduct,
                read: loadProduct,
                update: updateProduct,
                delete: deleteProduct
            };
            return;
        case 'categories':
            const {getCategoryInfo} = await import('../../api/categories.js');
            itemController = {
                create: null,
                read: getCategoryInfo,
                update: null,
                delete: null
            };
            return;
        case 'shipping':
            const {loadShippingOption} = await import('../../api/shipping.js');
            itemController = {
                create: null,
                read: loadShippingOption,
                update: null,
                delete: null
            };
            return;
    }
}

function setItemWindowEvent(){
    const dashboardItems = document.querySelectorAll('.js-dashboard-item');
    
    dashboardItems.forEach(item => {
        item.addEventListener('click', async () => {
            const {id} = item.dataset;
            await itemController.read(id);

            const overlay = document.createElement('div');
            overlay.classList.add('dashboard-overlay');

            overlay.animate([
                {opacity: 0},
                {opacity: 1}
            ], {
                duration: 150,
                easing: 'ease-in'
            });

            overlay.innerHTML = renderItemWindow();
            document.body.appendChild(overlay);

            const closeButton = document.querySelector('.js-close-button');
            closeButton.addEventListener('click', async () => {
                const closeAnimation = overlay.animate([
                    {opacity: 1},
                    {opacity: 0}
                ], {
                    duration: 150,
                    easing: 'ease-out'
                });
                await closeAnimation.finished;
                document.body.removeChild(overlay);
            });
        });
    });
}

export default renderDashboardItemsComponent;