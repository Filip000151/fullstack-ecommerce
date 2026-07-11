import {createElement, renderItemViewWindow, renderCreateNewItemWindow, renderUpdateItemWindow, renderProductCoverImage, renderProductImages, togglePopup} from "./template.js";

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
                type: dataType,
                create: null,
                read: loadOrder,
                update: null,
                delete: cancelOrder
            }
            return;
        case 'products':
            const {loadProduct, createProduct, updateProduct, deleteProduct} = await import('../../api/products.js');
            itemController = {
                type: dataType,
                create: createProduct,
                read: loadProduct,
                update: updateProduct,
                delete: deleteProduct
            };
            return;
        case 'categories':
            const {getCategoryInfo, createCategory, deleteCategory, updateCategory} = await import('../../api/categories.js');
            itemController = {
                type: dataType,
                create: createCategory,
                read: getCategoryInfo,
                update: updateCategory,
                delete: deleteCategory
            };
            return;
        case 'shipping':
            const {loadShippingOption, createShippingOption, deleteShippingOption, updateShippingOption} = await import('../../api/shipping.js');
            itemController = {
                type: dataType,
                create: createShippingOption,
                read: loadShippingOption,
                update: updateShippingOption,
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

            displayItem();
        });
    });

    function displayItem(){
        openItemWindow(renderItemViewWindow());

        const closeButton = document.querySelector('.js-close-button');
        closeButton.addEventListener('click', closeItemWindow);

        const deleteButton = document.querySelector('.js-delete-button');
        deleteButton.addEventListener('click', () => {
            const {id} = deleteButton.dataset;
            const modal = togglePopup();
            modal.showModal();
            document.querySelector('.js-dialog-yes-button').addEventListener('click', async () => {
                await itemController.delete(id, {redirect: `/dashboard/${itemController.type}`});
                modal.close();
                togglePopup();
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
            cancelButton.addEventListener('click', displayItem);

            const saveButton = document.querySelector('.js-dashboard-save-button');
            saveButton.addEventListener('click', async () => {
                const {id} = saveButton.dataset;
                const body = getAppropriateFields();
                const data = await itemController.update(id, body);
                if(data.success) displayItem();
            });

            if(itemController.type === 'products') setProductImagePreviewEvent();
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
            const body = getAppropriateFields();
            await itemController.create(body, {redirect: `/dashboard/${itemController.type}`});
        });
    });

    function getAppropriateFields(){
        switch(itemController.type){
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