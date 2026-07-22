import renderNotFoundComponent from "../components/NotFoundSection/index.js";

export default function renderPage(){
    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    renderNotFoundComponent();
}