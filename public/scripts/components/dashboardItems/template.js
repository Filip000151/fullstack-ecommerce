import convertDateToObject from '../../utils/dates.js';
import formatCurrency from '../../utils/money.js';

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
    console.log(items);
    const html = `
        <a href="/dashboard" class="dashboard-back-link">Back</a>
        <h4>${getTitle()}</h4>
        <div class="dashboard-item-scroller">
            ${renderItems()}
        </div>
        ${dataType !== 'orders' ? `
        <button class="dashboard-new-button" data-item-type="${dataType}">New</button>
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
}

export function renderItems(){
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
    return html;
}

export function renderItemWindow(){
    const html = `
        <div class="dashboard-item-content">
            <button class="dashboard-item-close-button js-close-button">&#x2715;</button>
            ${renderItemContent()}
        </div>
    `;
    console.log(items);
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
                                <button class="dashboard-item-crud-button">Delete</button>
                                <button class="dashboard-item-crud-button">Update</button>
                            </div>
                        </div>
                        <div class="dashboard-item-right-section">
                            <div class="dashboard-item-image-field">
                                <p>Cover:</p>
                                <div class="dashboard-item-cover-container">
                                    <img src="${item.coverImage}">
                                </div>
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
                                <button class="dashboard-item-crud-button">Delete</button>
                                <button class="dashboard-item-crud-button">Update</button>
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
                                <button class="dashboard-item-crud-button">Delete</button>
                                <button class="dashboard-item-crud-button">Update</button>
                            </div>
                        </div>
                    </div>
                `;
        }

        function renderProductImages(){
            let html = '';
            item.images.forEach(image => {
                html += `
                    <div class="dashboard-item-image-container">
                        <img src="${image}">
                    </div>
                `;
            });
            return html;
        }

        function renderCategoryProducts(){
            let html = '';
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
            return html;
        }

        function renderOrderProducts(){
            console.log(item);
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

export default createElement;