export function createElement(){
    const html = `
        <p class="not-found-code">404</p>
        <p class="not-found-text">Not Found</p>
        <p class="not-found-description">The resource requested could not be found on this server!</p>
        <p class="not-found-link"><a href="/" data-navigate>Return Home</a></p>
    `;

    const NotFoundSection = document.createElement('div');
    NotFoundSection.classList.add('not-found-section');
    NotFoundSection.innerHTML = html;

    const container = document.querySelector('.container');
    container.appendChild(NotFoundSection);
}

export default createElement;