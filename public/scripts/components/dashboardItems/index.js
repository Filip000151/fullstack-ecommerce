import renderPageSpinner, { renderElementSpinner } from "../../utils/spinner.js";
import {createElement, renderItemViewWindow, renderCreateNewItemWindow, renderUpdateItemWindow, renderProductCoverImage, renderProductImages, togglePopup, renderMoreItems, addMoreUpdateItems, renderMoreItemsLoading, renderItemWindowLoading} from "./template.js";

let itemController;

export async function renderDashboardItemsComponent(dataType){
    await createElement(dataType);
    await importCrudOperations(dataType);

    loadMoreEvent();
    setViewItemWindowEvent();
    setCreateNewItemEvent();
}

function loadMoreEvent(){
    const loadMoreButton = document.querySelector('.js-load-more-button');
    if(!loadMoreButton) return;

    loadMoreButton.addEventListener('click', async () => {
        const spinner = renderMoreItemsLoading();
        itemController.page += 1;
        await itemController.query({limit: 15, page: itemController.page});
        spinner.remove();
        renderMoreItems();
        loadMoreEvent();
        setViewItemWindowEvent();
    });
}

async function importCrudOperations(dataType){
    const loader = {
        orders: async () => {
            const {loadOrder, cancelOrder} = await import('../../api/orders.js');
            itemController = {
                type: dataType,
                create: null,
                read: loadOrder,
                update: null,
                delete: cancelOrder
            }
        },
        products: async () => {
            const {loadProduct, createProduct, updateProduct, deleteProduct, queryProducts} = await import('../../api/products.js');
            itemController = {
                type: dataType,
                query: queryProducts,
                page: 1,
                create: createProduct,
                read: loadProduct,
                update: updateProduct,
                delete: deleteProduct
            };
        },
        categories: async () => {
            const {getCategoryInfo, createCategory, deleteCategory, updateCategory} = await import('../../api/categories.js');
            const {products, queryProducts} = await import('../../api/products.js');
            itemController = {
                type: dataType,
                query: queryProducts,
                data: products,
                page: 1,
                create: createCategory,
                read: getCategoryInfo,
                update: updateCategory,
                delete: deleteCategory
            };
        },
        shipping: async () => {
            const {loadShippingOption, createShippingOption, deleteShippingOption, updateShippingOption} = await import('../../api/shipping.js');
            itemController = {
                type: dataType,
                create: createShippingOption,
                read: loadShippingOption,
                update: updateShippingOption,
                delete: deleteShippingOption
            };
        }
    }
    await loader[dataType]();
}

function setViewItemWindowEvent(){
    const dashboardItems = document.querySelectorAll('.js-dashboard-item');
    
    dashboardItems.forEach(item => {
        const clonedItem = item.cloneNode(true);
        item.replaceWith(clonedItem);
        clonedItem.addEventListener('click', async () => {
            const {id} = clonedItem.dataset;
            displayItem(async () => {
                await itemController.read(id);
            });
        });
    });

    async function displayItem(asyncFunc){
        openItemWindow(renderItemWindowLoading());
        if(asyncFunc){
            const itemInfo = document.querySelector('.js-dashboard-item-info');
            renderElementSpinner(itemInfo);
            await asyncFunc();
        }
        openItemWindow(renderItemViewWindow());

        const images = document.querySelectorAll('.js-dashboard-item-image-container');
        images.forEach(image => {
            const img = image.children[0];
            img.decode().then(() => {
                const skeletonElements = document.querySelectorAll('.skeleton');
                if(skeletonElements) skeletonElements.forEach(element => element.remove());
                image.style.display = 'block';
            });
        });

        const closeButton = document.querySelector('.js-close-button');
        closeButton.addEventListener('click', closeItemWindow);

        const deleteButton = document.querySelector('.js-delete-button');
        deleteButton.addEventListener('click', () => {
            const {id} = deleteButton.dataset;
            const modal = togglePopup();
            modal.showModal();
            document.querySelector('.js-dialog-yes-button').addEventListener('click', async () => {
                modal.close();
                const spinner = renderPageSpinner();
                await itemController.delete(id, {redirect: `/dashboard/${itemController.type}`});
                togglePopup();
                spinner.remove();
            });
            document.querySelector('.js-dialog-no-button').addEventListener('click', () => {
                modal.close();
                togglePopup();
            });
        });

        setUpdateItemEvent();
    }
    function setUpdateItemEvent(){
        const updateButton = document.querySelector('.js-update-button');
        if(!updateButton) return;
        const currentImages = [];

        updateButton.addEventListener('click', async () => {
            const html = await renderUpdateItemWindow();
            openItemWindow(html);

            const closeButton = document.querySelector('.js-close-button');
            closeButton.addEventListener('click', closeItemWindow);

            const cancelButton = document.querySelector('.js-dashboard-cancel-button');
            cancelButton.addEventListener('click', () => displayItem());

            const saveButton = document.querySelector('.js-dashboard-save-button');
            saveButton.addEventListener('click', async () => {
                const spinner = renderPageSpinner();
                const {id} = saveButton.dataset;
                const body = getAppropriateFields();
                const data = await itemController.update(id, body);
                spinner.remove();
                if(data.success) displayItem();
            });

            loadMoreUpdateItemsEvent();

            if(itemController.type === 'products') setProductImagePreviewEvent();

            function loadMoreUpdateItemsEvent(){
                const loadMoreText = document.querySelector('.js-load-more-text');
                if(loadMoreText){
                    loadMoreText.addEventListener('click', async () => {
                        loadMoreText.remove();
                        itemController.page += 1;
                        await itemController.query({category: 'uncategorised', limit: 10, page: itemController.page});
                        const itemList = document.querySelector('.dashboard-item-list');
                        itemList.innerHTML += addMoreUpdateItems(itemController.data);
                        loadMoreUpdateItemsEvent();
                    });
                }
            }
        });

        function setProductImagePreviewEvent(){
            const coverImageInput = document.querySelector('.js-cover-image-upload');
            const coverImageContainer = document.querySelector('.js-dashboard-item-cover-container');

            const imagesInput = document.querySelector('.js-images-upload');
            const imageElements = document.querySelectorAll('.js-dashboard-image');
            imageElements.forEach(image => {
                const {imagePath} = image.dataset;
                currentImages.push(imagePath);
            });
            const imagesScroller = document.querySelector('.js-dashboard-item-images-scroller');

            coverImageInput.addEventListener('change', () => {
                const file = coverImageInput.files[0];
                if(file){
                    const reader = new FileReader();
                    reader.onload = (e) => {       
                        coverImageContainer.innerHTML = `
                                    <button class="dashboard-image-close-button js-cover-image-close-button">&#215;</button>
                                    <img src="${e.target.result}">
                            `;
                        const coverImageCloseButton = document.querySelector('.js-cover-image-close-button');
                        if(coverImageCloseButton){
                            coverImageCloseButton.addEventListener('click', () => {
                                coverImageInput.value = '';
                                coverImageContainer.innerHTML = renderProductCoverImage();
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });

            renderAllImages();
            imagesScroller.addEventListener('click', (e) => {
                if(e.target.classList.contains('js-dashboard-old-image-close-button')){
                    const {imagePath} = e.target.dataset;
                    const index = currentImages.indexOf(imagePath);
                    if(index > -1) currentImages.splice(index, 1);
                    renderAllImages();
                }
                if(e.target.classList.contains('js-dashboard-image-close-button')){
                    const index = parseInt(e.target.dataset.fileIndex);
                    if(!isNaN(index)){
                        removeFile(index);
                        renderAllImages();
                    }
                }
            });
            imagesInput.addEventListener('change', renderAllImages);

            function renderAllImages(){
                imagesScroller.innerHTML = renderProductImages(currentImages);
                readImageFiles();
            }

            function readImageFiles(){
                const files = imagesInput.files;
                for(let i = 0; i < files.length; i++){
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagesScroller.innerHTML += `
                            <div class="dashboard-item-image-container">
                                <button class="dashboard-image-close-button js-dashboard-image-close-button" data-file-index="${i}">&#215;</button>
                                <img src="${e.target.result}">
                            </div>
                        `;
                    };

                    reader.readAsDataURL(file);
                }
            }

            function removeFile(index){
                const dt = new DataTransfer();
                const {files} = imagesInput;

                for(let i = 0; i < files.length; i++){
                    if(i !== index){
                        dt.items.add(files[i]);
                    }
                }

                imagesInput.files = dt.files;
            }
        }

        function getAppropriateFields(){
            switch(itemController.type){
                case 'products':
                    const formData = new FormData();
                    formData.append('name', document.querySelector('.js-name-input').value);
                    const priceCents = Math.round(Number(document.querySelector('.js-price-input').value) * 100);
                    formData.append('priceCents', priceCents);
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
                    for(let i = 0; i < currentImages.length; i++){
                        formData.append('currentImages', currentImages[i]);
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
    }
}

function setCreateNewItemEvent(){
    const newButton = document.querySelector('.js-dashboard-new-button');
    if(!newButton) return;

    newButton.addEventListener('click', async () => {
        const html = await renderCreateNewItemWindow();
        openItemWindow(html);
        
        const closeButton = document.querySelector('.js-close-button');
        closeButton.addEventListener('click', closeItemWindow);

        if(itemController.type === 'products') setProductImagePreviewEvent();
        
        
        const saveButton = document.querySelector('.js-dashboard-save-button');
        saveButton.addEventListener('click', async () => {
            const spinner = renderPageSpinner();
            const body = getAppropriateFields();
            await itemController.create(body, {redirect: `/dashboard/${itemController.type}`});
            spinner.remove();
        });
    });

    function getAppropriateFields(){
        switch(itemController.type){
            case 'products':
                const formData = new FormData();
                formData.append('name', document.querySelector('.js-name-input').value);
                const priceCents = Math.round(Number(document.querySelector('.js-price-input').value) * 100);
                formData.append('priceCents', priceCents);
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
    const overlay = document.querySelector('.dashboard-overlay');
    if(overlay){
        overlay.innerHTML = html;
    }
    else{
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