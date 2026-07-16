export function renderSpinner(element){

    const loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-overlay');
    loaderOverlay.innerHTML = `
        <div class="spinner"></div>
        <p>Processing...</p>
    `;

    element.appendChild(loaderOverlay);
    return loaderOverlay;
}

export default renderSpinner;