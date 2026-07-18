import convertDateToObject from '../../utils/dates.js';
import formatCurrency from '../../utils/money.js';
import { renderElementSpinner } from '../../utils/spinner.js';

const items = {
    type: null,
    data: null
};

async function importData(dataType){
    items.type = dataType;
    switch(dataType){
        case 'orders':
            const {orders} = await import('../../api/orders.js');
            items.data = orders;
            return;
        case 'products':
            const {products} = await import('../../api/products.js');
            items.data = products;
            return;
        case 'categories':
            const {categories} = await import('../../api/categories.js');
            items.data = categories;
            return;
        case 'shipping':
            const {shipping} = await import('../../api/shipping.js');
            items.data = shipping;
            return;
    }
}

export async function createElement(dataType){
    await importData(dataType);
    const html = `
        <a href="/dashboard" class="dashboard-back-link">Back</a>
        <h4>${getTitle()}</h4>
        <div class="dashboard-item-scroller">
            ${renderItems()}
        </div>
        ${dataType !== 'orders' ? `
        <button class="dashboard-new-button js-dashboard-new-button">New</button>
        ` : ''}
    `;

    let dashboardItems = document.querySelector('.dashboard-items');
    if(dashboardItems){
        dashboardItems.innerHTML = html;
    }
    else{
        dashboardItems = document.createElement('div');
        dashboardItems.classList.add('dashboard-items');
        dashboardItems.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(dashboardItems);
    }

    function getTitle(){
        switch(dataType){
            case 'orders':
                return 'Orders';
            case 'products':
                return 'Products';
            case 'categories':
                return 'Categories';
            case 'shipping':
                return 'Shipping Options'
        }
    }
    function renderItems(){
        let html = '';
        if(items.type === 'orders'){
            items.data.list.forEach(item => {
                const creationDate = convertDateToObject(item.createdAt);
                html += `
                    <div class="dashboard-item js-dashboard-item" data-id="${item._id}">
                        <p>${creationDate.dayNum}. ${creationDate.monthNum}. ${creationDate.year}.</p>
                        <p>${item.status}</p>
                    </div>
                `;
            });
        }
        else{
            items.data.list.forEach(item => {
                html += `
                    <div class="dashboard-item js-dashboard-item" data-id="${item._id}">
                        <p>${item.name}</p>
                    </div>
                `;
            });
        }

        if(items.type === 'products' && items.data.pagination.hasNextPage){
            html += `
                <div class="dashboard-item-load-more js-load-more-button">
                    <p>Load more...</p>
                </div>
            `;
        }
        return html;
    }
}

export function renderItemViewWindow(){
    const html = `
        <div class="dashboard-item-content">
            <button class="dashboard-item-close-button js-close-button">&#x2715;</button>
            ${renderItemContent()}
        </div>
    `;
    return html;

    function renderItemContent(){
        const item = items.data.current;
        switch(items.type){
            case 'products':
                return `
                    <h4>${item.name}</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-field">
                                    <p>Price:</p>
                                    <p class="dashboard-item-field-value">$${formatCurrency(item.priceCents)}</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Featured:</p>
                                    <p>${item.isFeatured ? 'Yes' : 'No'}</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Category:</p>
                                    <p>${item.category ? item.category.name : 'Uncategorised'}</p>
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-delete-button" data-id="${item._id}">Delete</button>
                                <button class="dashboard-item-crud-button js-update-button">Update</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-image-field">
                                <p>Cover:</p>
                                <div class="dashboard-item-cover-container js-dashboard-item-image-container" style="display: none">
                                    <img src="${item.coverImage}">
                                </div>
                                <div class="dashboard-item-cover-container skeleton" style="height: 300px; width: 300px;"></div>
                            </div>
                            <div class="dashboard-item-image-field">
                                <p>Images:</p>
                                <div class="dashboard-item-images-scroller">
                                    ${renderProductImages()}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 'categories':
                return `
                    <h4>${item.name}</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-list">
                                ${renderCategoryProducts()}
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-delete-button" data-id="${item._id}">Delete</button>
                                <button class="dashboard-item-crud-button js-update-button">Update</button>
                            </div>
                        </div>
                    </div>
                `;
            case 'orders':
                const creationDate = convertDateToObject(item.createdAt);
                const deliveryDate = convertDateToObject(item.deliveryDate);
                return `
                    <h4>${creationDate.dayNum}. ${creationDate.monthNum}. ${creationDate.year}.</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-field">
                                    <p>User:</p>
                                    <p class="dashboard-item-field-value">${item.user ? item.user.email : item.guestEmail}</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Delivery Address:</p>
                                    <p class="dashboard-item-field-value">${item.deliveryAddress}</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Shipping Option:</p>
                                    <p class="dashboard-item-field-value">${item.shippingSnapshot.name}($${formatCurrency(item.shippingSnapshot.priceCents)})</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Total Price:</p>
                                    <p class="dashboard-item-field-value">$${formatCurrency(item.totalPriceCents)}</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Status:</p>
                                    <p class="dashboard-item-field-value">${item.status}</p>
                                </div>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-list">
                                ${renderOrderProducts()}
                            </div>
                        </div>
                    </div>
                `;
            case 'shipping':
                return `
                    <h4>${item.name}</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-field">
                                    <p>Delivery days:</p>
                                    <p class="dashboard-item-field-value">${item.deliveryDays} day(s)</p>
                                </div>
                                <div class="dashboard-item-field">
                                    <p>Price:</p>
                                    <p class="dashboard-item-field-value">$${formatCurrency(item.priceCents)}</p>
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-delete-button" data-id="${item._id}">Delete</button>
                                <button class="dashboard-item-crud-button js-update-button">Update</button>
                            </div>
                        </div>
                    </div>
                `;
        }

        function renderProductImages(){
            let html = '';
            item.images.forEach(image => {
                html += `
                    <div class="dashboard-item-image-container js-dashboard-item-image-container" style="display: none;">
                        <img src="${image}">
                    </div>
                    <div class="dashboard-item-image-container skeleton" style="height: 100px; width: 100px;"></div>
                `;
            });
            return html;
        }

        function renderCategoryProducts(){
            let html = '';
            if(item.products.length > 0){
                item.products.forEach(product => {
                    html += `
                        <div class="dashboard-list-item">
                            <div class="dashboard-list-item-image-container">
                                <img src="${product.coverImage}">
                            </div>
                            <p>${product.name}</p>
                        </div>
                    `;
                });
            }
            else{
                html = 'This category has no products.';
            }
            
            return html;
        }

        function renderOrderProducts(){
            let html = '';
            item.items.forEach(item => {
                html += `
                    <div class="dashboard-list-item">
                        <div class="dashboard-list-item-image-container">
                            <img src="${item.productSnapshot.coverImage}">
                        </div>
                        <p>${item.productSnapshot.name}</p>
                        <div class="dashboard-list-item-price-field">
                            <p>$${formatCurrency(item.productSnapshot.priceCents)}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                `;
            });
            return html;
        }
    }
}

export function renderItemWindowLoading(){
    const html = `
        <div class="dashboard-item-content">
            <div class="dashboard-item-close-button skeleton"></div>
            <div style="display: flex; justify-content: center;">
                <div class="skeleton" style="width: 100px; height: 20px;"></div>
            </div>
            <div class="dashboard-item-info js-dashboard-item-info" style="position: relative; height: 500px;"></div>
        </div>
    `;
    return html;
}

export async function renderCreateNewItemWindow(){
    const fieldsHtml = await renderFields();
    const html = `
        <div class="dashboard-item-content">
            <button class="dashboard-item-close-button js-close-button">&#x2715;</button>
            ${fieldsHtml}
        </div>
    `;

    return html;

    async function renderFields(){
        switch(items.type){
            case 'products':
                const {categories} = await import('../../api/categories.js');
                return `
                    <h4>New Product</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Price:</label>
                                    <input class="js-price-input" type="number" placeholder="Enter price">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Featured:</label>
                                    <input class="js-featured-input" type="checkbox">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Category:</label>
                                    <select class="js-category-input">
                                        <option value="">Uncategorised</option>
                                        ${renderCategories(categories)}
                                    </select>
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-save-button">Save</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Cover Image:</label>
                                    <input class="js-cover-image-upload" type="file" accept="image/*">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Images:</label>
                                    <input class="js-images-upload" type="file" accept="image/*" multiple>
                                </div>
                            </div>
                            <div class="dashboard-item-image-field">
                                <p>Cover:</p>
                                <div class="dashboard-item-cover-container js-dashboard-item-cover-container">
                                    
                                </div>
                            </div>
                            <div class="dashboard-item-image-field">
                                <p>Images:</p>
                                <div class="dashboard-item-images-scroller js-dashboard-item-images-scroller">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 'shipping':
                return `
                    <h4>New Shipping Option</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Delivery Days:</label>
                                    <input class="js-delivery-days-input" type="number" placeholder="Enter number of days">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Price:</label>
                                    <input class="js-price-input" type="number" placeholder="Enter price">
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-save-button">Save</button>
                            </div>
                        </div>
                    </div>
                `;
            case 'categories':
                const {products, queryProducts} = await import('../../api/products.js');
                await queryProducts({category: 'uncategorised'});
                return `
                    <h4>New Category</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Displayed:</label>
                                    <input class="js-displayed-input" type="checkbox">
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-save-button">Save</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-list">
                                ${renderProductList(products.list)}
                            </div>
                        </div>
                    </div>
                `;
        }

        function renderCategories(categories){
            let html = '';
            categories.list.forEach(category => {
                html += `<option value="${category._id}">${category.name}</option>`;
            });
            return html;
        }

        function renderProductList(products){
            let html = '';
            if(products.length > 0){
                products.forEach(product => {
                    html += `
                        <div class="dashboard-list-item">
                            <input class="js-product-input" type="checkbox" data-id=${product._id}>
                            <div class="dashboard-list-item-image-container">
                                <img src="${product.coverImage}">
                            </div>
                            <p>${product.name}</p>
                        </div>
                    `;
                });
            }
            else{
                html = 'No uncategorised products.';
            }
            
            return html;
        }
    }
}

export async function renderUpdateItemWindow(){
    const fieldsHtml = await renderFields();
    const html = `
        <div class="dashboard-item-content">
            <button class="dashboard-item-close-button js-close-button">&#x2715;</button>
            ${fieldsHtml}
        </div>
    `;

    return html;

    async function renderFields(){
        const item = items.data.current;
        switch(items.type){
            case 'products':
                const {categories} = await import('../../api/categories.js');
                return `
                    <h4>Update Product</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name" value="${item.name}">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Price:</label>
                                    <input class="js-price-input" type="number" placeholder="Enter price" value="${item.priceCents}">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Featured:</label>
                                    <input class="js-featured-input" type="checkbox" ${item.isFeatured ? 'checked' : ''}>
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Category:</label>
                                    <select class="js-category-input">
                                        <option value="">Uncategorised</option>
                                        ${renderCategories(categories)}
                                    </select>
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-cancel-button">Cancel</button>
                                <button class="dashboard-item-crud-button js-dashboard-save-button" data-id="${item._id}">Save</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Cover Image:</label>
                                    <input class="js-cover-image-upload" type="file" accept="image/*">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Images:</label>
                                    <input class="js-images-upload" type="file" accept="image/*" multiple>
                                </div>
                            </div>
                            <div class="dashboard-item-image-field">
                                <p>Cover:</p>
                                <div class="dashboard-item-cover-container js-dashboard-item-cover-container">
                                    <img src=${item.coverImage}>
                                </div>
                            </div>
                            <div class="dashboard-item-image-field">
                                <p>Images:</p>
                                <div class="dashboard-item-images-scroller js-dashboard-item-images-scroller">
                                    ${renderProductImages(item.images)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 'shipping':
                return `
                    <h4>Update Shipping Option</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name" value="${item.name}">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Delivery Days:</label>
                                    <input class="js-delivery-days-input" type="number" placeholder="Enter number of days" value="${item.deliveryDays}">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Price:</label>
                                    <input class="js-price-input" type="number" placeholder="Enter price" value="${item.priceCents}">
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-cancel-button">Cancel</button>
                                <button class="dashboard-item-crud-button js-dashboard-save-button" data-id="${item._id}">Save</button>
                            </div>
                        </div>
                    </div>
                `;
            case 'categories':
                const {products, queryProducts} = await import('../../api/products.js');
                await queryProducts({category: 'uncategorised', limit: 10});
                return `
                    <h4>Update Category</h4>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-left-section">
                            <div class="dashboard-item-fields">
                                <div class="dashboard-item-input">
                                    <label>Name:</label>
                                    <input class="js-name-input" type="text" placeholder="Enter name" value="${item.name}">
                                </div>
                                <div class="dashboard-item-input">
                                    <label>Display on homepage:</label>
                                    <input class="js-displayed-input" type="checkbox" ${item.isDisplayed ? 'checked' : ''}>
                                </div>
                            </div>
                            <div class="dashboard-item-crud-buttons">
                                <button class="dashboard-item-crud-button js-dashboard-cancel-button">Cancel</button>
                                <button class="dashboard-item-crud-button js-dashboard-save-button" data-id="${item._id}">Save</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-list">
                                ${renderProductList(products, item.products)}
                            </div>
                        </div>
                    </div>
                `;
        }

        function renderCategories(categories){
            let html = '';
            categories.list.forEach(category => {
                html += `<option value="${category._id}" ${item.category && item.category._id === category._id ? 'selected' : ''}>${category.name}</option>`;
            });
            return html;
        }

        function renderProductList(products, categoryProducts){
            let html = '';
            if(products.list.length > 0 || categoryProducts.length > 0){
                categoryProducts.forEach(product => {
                    html += `
                        <div class="dashboard-list-item">
                            <input class="js-product-input" type="checkbox" data-id=${product._id} checked>
                            <div class="dashboard-list-item-image-container">
                                <img src="${product.coverImage}">
                            </div>
                            <p>${product.name}</p>
                        </div>
                    `;
                });
                products.list.forEach(product => {
                    html += `
                        <div class="dashboard-list-item">
                            <input class="js-product-input" type="checkbox" data-id=${product._id}>
                            <div class="dashboard-list-item-image-container">
                                <img src="${product.coverImage}">
                            </div>
                            <p>${product.name}</p>
                        </div>
                    `;
                });
            }
            else{
                html = 'No products found.';
            }

            if(products.pagination.hasNextPage){
                html += '<p class="dashboard-load-more-text js-load-more-text">Load more...</p>';
            }
            
            return html;
        }
    }
}

export function renderProductImages(images){
    let html = '';
    images.forEach(image => {
        html += `
            <div class="dashboard-item-image-container">
                <button class="dashboard-image-close-button js-dashboard-old-image-close-button" data-image-path="${image}">&#215;</button>
                <img src="${image}" data-image-path="${image}" class="js-dashboard-image">
            </div>
        `
    });
    return html;
}

export function renderProductCoverImage(){
    return `<img src="${items.data.current.coverImage}">`;
}

export function togglePopup(){
    const dialog = document.querySelector('.dashboard-dialog');
    if(dialog){
        document.body.removeChild(dialog);
    }
    else{
        const dialog = document.createElement('dialog');
        dialog.classList.add('dashboard-dialog');
        dialog.innerHTML = `
            <h4>Delete item?</h4>
            <div class="dialog-buttons">
                <button class="dialog-button js-dialog-no-button">No</button>
                <button class="dialog-button js-dialog-yes-button">Yes</button>
            </div>
        `;
        document.body.appendChild(dialog);
        return dialog;
    }
}

export function renderMoreItems(){
    const itemScroller = document.querySelector('.dashboard-item-scroller');
    items.data.list.forEach(item => {
        const dashboardItem = document.createElement('div');
        dashboardItem.classList.add('dashboard-item');
        dashboardItem.classList.add('js-dashboard-item');
        dashboardItem.dataset.id = item._id;
        dashboardItem.innerHTML = `<p>${item.name}</p>`;
        itemScroller.appendChild(dashboardItem); 
    });
    if(items.data.pagination.hasNextPage){
        const loadMoreButton = document.createElement('div');
        loadMoreButton.classList.add('dashboard-item-load-more');
        loadMoreButton.classList.add('js-load-more-button');
        loadMoreButton.innerHTML = '<p>Load more...</p>';
        itemScroller.appendChild(loadMoreButton);
    }
}

export function renderMoreItemsLoading(){
    const itemScroller = document.querySelector('.dashboard-item-scroller');
    const loadMoreButton = document.querySelector('.js-load-more-button');
    loadMoreButton.style.pointerEvents = 'none';
    loadMoreButton.style.position = 'relative';
    renderElementSpinner(loadMoreButton);
    return loadMoreButton;
}

export function addMoreUpdateItems(data){
    let html = '';
    data.list.forEach(item => {
        html += `
            <div class="dashboard-list-item">
                <input class="js-product-input" type="checkbox" data-id=${item._id}>
                <div class="dashboard-list-item-image-container">
                    <img src="${item.coverImage}">
                </div>
                <p>${item.name}</p>
            </div>
        `;
    });
    if(data.pagination.hasNextPage){
        html += '<p class="dashboard-load-more-text js-load-more-text">Load more...</p>';
    }
    return html;
}

export function renderDashboardItemsSkeleton(){
    const dashboardItemsSkeleton = document.createElement('div');
    dashboardItemsSkeleton.classList.add('dashboard-items');
    const html = `
        <div class="dashboard-back-link skeleton" style="width: 50px; height: 20px;"></div>
        <div class="skeleton" style="width: 100px; height: 20px; margin: 1em 0;"></div>
        <div class="dashboard-item-scroller" style="position: relative; min-height: 700px;"></div>
        <div class="dashboard-new-button skeleton" style="width: 100px; height: 20px;"></div>
    `;
    dashboardItemsSkeleton.innerHTML = html;
    renderElementSpinner(dashboardItemsSkeleton.children[2]);
    const container = document.querySelector('.container');
    container.appendChild(dashboardItemsSkeleton);
    return dashboardItemsSkeleton;
}

export default createElement;