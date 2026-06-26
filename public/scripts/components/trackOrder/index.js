import { cancelOrder } from "../../api/orders.js";
import createElement from "./template.js";

export function renderTrackOrderComponent(){
    createElement();
    setCancelOrderEvent();
}

function setCancelOrderEvent(){
    const cancelButton = document.querySelector('.js-cancel-order-button');
    if(cancelButton){
        const cancelOrderModal = document.querySelector('.js-cancel-order-modal-overlay');
        const noButton = document.querySelector('.js-cancel-order-no-button');
        const yesButton = document.querySelector('.js-cancel-order-yes-button');

        cancelButton.addEventListener('click', () => cancelOrderModal.style.visibility = 'visible');

        noButton.addEventListener('click', () => cancelOrderModal.style.visibility = 'hidden');
        yesButton.addEventListener('click', async () => {
            const {orderId} = yesButton.dataset;
            await cancelOrder(orderId);
        });
    }

   
}

export default renderTrackOrderComponent;