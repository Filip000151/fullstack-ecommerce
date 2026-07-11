import {createElement, renderItemViewWindow, renderCreateNewItemWindow} from "./template.js";

let itemController;

export async function renderDashboardItemsComponent(dataType){
    await createElement(dataType);
    await importCrudOperations(dataType);
    setViewItemWindowEvent();
    setCreateNewItemEvent();
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
            const {getCategoryInfo, createCategory, deleteCategory} = await import('../../api/categories.js');
            itemController = {
                create: createCategory,
                read: getCategoryInfo,
                update: null,
                delete: deleteCategory
            };
            return;
        case 'shipping':
            const {loadShippingOption, createShippingOption, deleteShippingOption} = await import('../../api/shipping.js');
            itemController = {
                create: createShippingOption,
                read: loadShippingOption,
                update: null,
                delete: deleteShippingOption
            };
            return;
    }
}

function setViewItemWindowEvent(){
    const dashboardItems = document.querySelectorAll('.js-dashboard-item');
    
    dashboardItems.forEach(item => {
        item.addEventListener('click', async () => {
            const {id} = item.dataset;
            await itemController.read(id);

            openItemWindow(renderItemViewWindow());

            const closeButton = document.querySelector('.js-close-button');
            closeButton.addEventListener('click', closeItemWindow);

            const deleteButton = document.querySelector('.js-delete-button');
            deleteButton.addEventListener('click', async () => {
                const {id, itemType} = deleteButton.dataset;
                await itemController.delete(id, {redirect: `/dashboard/${itemType}`});
            });
        });
    });
}

function setCreateNewItemEvent(){
    const newButton = document.querySelector('.js-dashboard-new-button');
    if(!newButton) return;

    const {itemType} = newButton.dataset;

    newButton.addEventListener('click', async () => {
        const html = await renderCreateNewItemWindow();
        openItemWindow(html);
        
        const closeButton = document.querySelector('.js-close-button');
        closeButton.addEventListener('click', closeItemWindow);

        if(itemType === 'products') setProductImagePreviewEvent();
        
        
        const saveButton = document.querySelector('.js-dashboard-save-button');
        saveButton.addEventListener('click', async () => {
            const body = getAppropriateFields();
            await itemController.create(body, {redirect: `/dashboard/${itemType}`});
        });
    });

    function getAppropriateFields(){
        switch(itemType){
            case 'products':
                const formData = new FormData();
                formData.append('name', document.querySelector('.js-name-input').value);
                formData.append('priceCents', document.querySelector('.js-price-input').value);
                const isFeatured = document.querySelector('.js-featured-input').checked ? 'true' : 'false';
                formData.append('isFeatured', isFeatured);
                const categoryId = document.querySelector('.js-category-input').value;
                if(categoryId) formData.append('categoryId', categoryId);
                const coverImage = document.querySelector('.js-cover-image-upload').files[0];
                if(coverImage) formData.append('coverImage', coverImage);
                const images = document.querySelector('.js-images-upload').files;
                for(let i = 0; i < images.length; i++){
                    formData.append('images', images[i]);
                }
                return formData;
            case 'shipping':
                return {
                    name: document.querySelector('.js-name-input').value,
                    priceCents: document.querySelector('.js-price-input').value,
                    deliveryDays: document.querySelector('.js-delivery-days-input').value
                };
            case 'categories':
                const checkboxFields = document.querySelectorAll('.js-product-input');
                const checkedFields = [];
                checkboxFields.forEach(field => {
                    if(field.checked) checkedFields.push(field);
                });
                const productIds = checkedFields.map(field => field.dataset.id);
                return {
                    name: document.querySelector('.js-name-input').value,
                    isDisplayed: document.querySelector('.js-displayed-input').checked,
                    productIds
                };
        }
    }

    function setProductImagePreviewEvent(){
        const coverImageInput = document.querySelector('.js-cover-image-upload');
        const imagesInput = document.querySelector('.js-images-upload');

        coverImageInput.addEventListener('change', () => {
            const file = coverImageInput.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const coverImageContainer = document.querySelector('.js-dashboard-item-cover-container');       
                    coverImageContainer.innerHTML = `<img src="${e.target.result}">`;
                };
                reader.readAsDataURL(file);
            }
        });

        imagesInput.addEventListener('change', () => {
            const imagesScroller = document.querySelector('.js-dashboard-item-images-scroller');
            imagesScroller.innerHTML = '';

            const files = imagesInput.files;
            for(let i = 0; i < files.length; i++){
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagesScroller.innerHTML += `
                        <div class="dashboard-item-image-container">
                            <img src="${e.target.result}">
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function openItemWindow(html = ''){
    const overlay = document.createElement('div');
    overlay.classList.add('dashboard-overlay');

    overlay.animate([
        {opacity: 0},
        {opacity: 1}
    ], {
        duration: 150,
        easing: 'ease-in'
    });

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}
async function closeItemWindow(){
    const overlay = document.querySelector('.dashboard-overlay');
    if(!overlay) return;

    const closeAnimation = overlay.animate([
        {opacity: 1},
        {opacity: 0}
    ], {
        duration: 150,
        easing: 'ease-out'
    });
    await closeAnimation.finished;
    document.body.removeChild(overlay);
}

export default renderDashboardItemsComponent;