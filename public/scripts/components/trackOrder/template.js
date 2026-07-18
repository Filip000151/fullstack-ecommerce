import orders from '../../api/orders.js';
import auth from '../../api/auth.js';
import formatCurrency from '../../utils/money.js';
import convertDateToObject from '../../utils/dates.js';
import { renderElementSpinner } from '../../utils/spinner.js';

export function createElement(){
    const deliveryDate = convertDateToObject(orders.current.deliveryDate);
    const creationDate = convertDateToObject(orders.current.createdAt);

    const html = `
        ${orders.current.status !== 'cancelled' ? 
            `
            <h4>Arriving on ${deliveryDate.day}, ${deliveryDate.month} ${deliveryDate.dayNum}</h4>
            <div class="status-wrapper">
                <div class="status-info">
                    <div class="current-status">
                        <p class="status-active">Pending</p>
                        <p ${orders.current.progress >= 33 ? 'class="status-active"' : ''}>Processing</p>
                        <p ${orders.current.progress >= 67 ? 'class="status-active"' : ''}>Shipped</p>
                        <p ${orders.current.progress === 100 ? 'class="status-active"' : ''}>Delivered</p>
                    </div>
                    <div class="status-bar">
                        <div class="status-bar-progress" style="width: ${orders.current.progress}%"></div>
                    </div>
                </div>
            </div>
            ` : `<h4>Order cancelled</h4>`
        }
        
        <div class="track-order-details">
            <div class="track-order-products">
                ${renderOrderProducts()}
            </div>
            <div class="track-order-info">
                <div>
                    <div class="track-order-line">
                        <p class="track-order-label">Delivery Address:</p>
                        <p class="track-order-label-info">${orders.current.deliveryAddress}</p>
                    </div>
                    ${auth.isGuest ? `
                        <div class="track-order-line">
                            <p class="track-order-label">Email Address:</p>
                            <p class="track-order-label-info">${orders.current.guestEmail}</p>
                        </div>
                    ` : ''}
                    ${auth.currentUser && auth.currentUser.role === 'admin' ? `
                        <div class="track-order-line">
                            <p class="track-order-label">Email Address:</p>
                            <p class="track-order-label-info">${orders.current.user ? orders.current.user.email : orders.current.guestEmail}</p>
                        </div>
                    ` : ''}
                    <div class="track-order-line">
                        <p class="track-order-label">Order placed:</p>
                        <p class="track-order-label-info">${creationDate.dayNum}. ${creationDate.monthNum}. ${creationDate.year}.</p>
                    </div>
                    <div class="track-order-line">
                        <p class="track-order-label">Order arrival:</p>
                        <p class="track-order-label-info">${deliveryDate.dayNum}. ${deliveryDate.monthNum}. ${deliveryDate.year}.</p>
                    </div>
                    <div class="track-order-line">
                        <p class="track-order-label">Current status:</p>
                        <p class="track-order-label-info" 
                            ${orders.current.status === 'cancelled' ? 'style="color: rgba(145, 45, 45, 0.882);"' : ''}
                            ${orders.current.status === 'delivered' ? 'style="color: rgba(26, 107, 26, 0.76);"' : ''}>
                            ${orders.current.status}
                        </p>
                    </div>
                    <hr>
                    <div class="track-order-line">
                        <p class="track-order-label">Total product price:</p>
                        <p class="track-order-label-info">$${formatCurrency(getProductTotal())}</p>
                    </div>
                    <div class="track-order-line">
                        <p class="track-order-label">Shipping price (${orders.current.shippingSnapshot.name}):</p>
                        <p class="track-order-label-info">$${formatCurrency(orders.current.shippingSnapshot.priceCents)}</p>
                    </div>
                    <hr>
                    <div class="track-order-line">
                        <p class="track-order-label">Total:</p>
                        <p class="track-order-total">$${formatCurrency(orders.current.totalPriceCents)}</p>
                    </div>
                    ${orders.current.status === 'pending' ? 
                        `
                        <div class="cancel-order-button-wrapper">
                            <button class="cancel-order-button js-cancel-order-button">Cancel order</button>
                        </div>
                        <div class="cancel-order-modal-overlay js-cancel-order-modal-overlay" style="visibility: hidden;">
                            <div class="cancel-order-modal">
                                <h4>Cancel order?</h4>
                                <p>Are you sure you want to cancel this order?</p>
                                <div class="cancel-order-modal-buttons">
                                    <button class="cancel-order-modal-button js-cancel-order-no-button">No</button>
                                    <button class="cancel-order-modal-button js-cancel-order-yes-button" data-order-id="${orders.current._id}">Yes</button>
                                </div>
                            </div>
                        </div>
                        ` : ''
                    }
                    
                </div>
            </div>
        </div>
    `;

    let trackOrder = document.querySelector('.track-order-section');
    if(trackOrder){
        trackOrder.innerHTML = html;
    }
    else{
        trackOrder = document.createElement('section');
        trackOrder.classList.add('track-order-section');
        trackOrder.innerHTML = html;

        const container = document.querySelector('.container');
        container.appendChild(trackOrder);
    }

    function renderOrderProducts(){
        let html = '';

        orders.current.items.forEach(item => {
            html += `
                <div class="track-order-product">
                    <div class="track-order-product-image">
                        <img src="${item.productSnapshot.coverImage}" alt="">
                    </div>
                    <div class="track-order-product-details">
                        <p class="track-order-product-name">${item.productSnapshot.name}</p>
                        <div class="track-order-product-price">
                            <div>
                                <p>
                                    Price: <b>$${formatCurrency(item.productSnapshot.priceCents)}</b>
                                </p>
                                <p>
                                    Quantity: <b>${item.quantity}</b>
                                </p>
                            </div>
                            <div>
                                <p>Total:</p>
                                <p><b>$${formatCurrency(item.productSnapshot.priceCents * item.quantity)}</b></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function getProductTotal(){
        let total = 0;
        orders.current.items.forEach(item => {
            total += item.productSnapshot.priceCents * item.quantity;
        });
        return total;
    }
}

export function renderTrackOrderSkeleton(){
    const trackOrderSkeleton = document.createElement('section');
    trackOrderSkeleton.classList.add('track-order-section');
    const html = `
        <div style="display: flex; justify-content: center; margin: 2em 0;">
            <div class="skeleton" style="width: 300px; height: 30px;"></div>
        </div>
        <div class="status-wrapper">
            <div class="status-info">
                <div class="current-status">
                    <div class="skeleton" style="width: 120px; height: 30px;"></div>
                    <div class="skeleton" style="width: 120px; height: 30px;"></div>
                    <div class="skeleton" style="width: 120px; height: 30px;"></div>
                    <div class="skeleton" style="width: 120px; height: 30px;"></div>
                </div>
                <div class="status-bar skeleton"></div>
            </div>
        </div>
        <div class="track-order-details">
            <div class="track-order-products" style="position: relative;"></div>
            <div class="track-order-info">
                <div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <hr>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                    <hr>
                    <div class="track-order-line skeleton" style="height: 30px;"></div>
                </div>
            </div>
        </div>
    `;
    trackOrderSkeleton.innerHTML = html;
    renderElementSpinner(trackOrderSkeleton.children[2].children[0]);
    const container = document.querySelector('.container');
    container.appendChild(trackOrderSkeleton);
    return trackOrderSkeleton;
}

export default createElement;