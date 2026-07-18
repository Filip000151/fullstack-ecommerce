export function renderPageSpinner(){

    const loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-overlay');
    loaderOverlay.innerHTML = `
        <div class="spinner"></div>
        <p>Processing...</p>
    `;

    document.body.appendChild(loaderOverlay);
    return loaderOverlay;
}
export function renderElementSpinner(element){
    const loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-element-overlay');
    loaderOverlay.innerHTML = `
        <div class="spinner"></div>
    `;

    element.appendChild(loaderOverlay);
    return loaderOverlay;
}

export default renderPageSpinner;