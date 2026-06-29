import orders from '../../api/orders.js';
import formatCurrency from '../../utils/money.js';
import convertDateToObject from '../../utils/dates.js';

export function createElement(){
    const html = `
        <h4 class="your-orders-title">Your Orders</h4>
        <div class="orders-section">
            ${renderOrders()}
        </div>
    `;

    let ordersSection = document.querySelector('.your-orders-section');
    if(ordersSection){
        ordersSection.innerHTML = html;
    }
    else{
        ordersSection = document.createElement('section');
        ordersSection.classList.add('your-orders-section');
        ordersSection.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(ordersSection);
    }

    function renderOrders(){
        let html = '';

        orders.userOrders.forEach(order => {
            const creationDate = convertDateToObject(order.createdAt);
            html += `
                <div class="single-order">
                    <div class="single-order-header">
                        <div class="single-order-header-left">
                            <div class="header-group">
                                <p class="header-label">Order Placed:</p>
                                <p>${creationDate.month} ${creationDate.dayNum}</p>
                            </div>
                            <div class="header-group">
                                <p class="header-label">Total:</p>
                                <p>$${formatCurrency(order.totalPriceCents)}</p>
                            </div>
                            <div class="header-group">
                                <p class="header-label">Status:</p>
                                <p ${order.status === 'cancelled' ? 'style="color: rgba(145, 45, 45, 0.882); font-weight: bold;"' : ''}
                                ${order.status === 'delivered' ? 'style="color: rgba(26, 107, 26, 0.76); font-weight: bold;"' : ''}>
                                    ${order.status}
                                </p>
                            </div>
                        </div>
                        <div class="header-group">
                            <p class="header-label">Order ID:</p>
                            <p>${order._id}</p>
                        </div>
                    </div>
                    <div class="order-products">
                        ${renderOrderProducts(order)}
                    </div>
                    <div class="track-order-wrapper">
                        <a href="/orders/${order._id}">
                            <button class="track-order-button">Track Order</button>
                        </a>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function renderOrderProducts(order){
        let html = '';

        order.items.forEach(item => {
            html += `
                <div class="single-order-product-image-container">
                    <img src="${item.productSnapshot.coverImage}" alt="">
                </div>
                <div class="single-order-product-info">
                    <p class="single-order-product-name">${item.productSnapshot.name}</p>
                    <div class="single-order-product-price">
                        <p class="single-order-product-price-amount">$${formatCurrency(item.productSnapshot.priceCents)}</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
            `;
        });

        return html;
    }
}

export default createElement;