import createQueryString from "../../utils/query.js";
import renderElement from "./template.js";


export function renderHeaderComponent() {
    renderElement();
    setEvents();
}

function setEvents(){
    const searchBar = document.querySelector(".js-search-bar");
    const categorySelection = document.querySelector(".js-category-selection");
    const searchButton = document.querySelector(".js-search-button");

    searchButton.addEventListener("click", queryProducts);
    searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            queryProducts();
        }
    });
    categorySelection.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            queryProducts();
        }
    });

    function queryProducts() {
        if (!window.location.href.includes("/products")) {
            const params = {
                category: categorySelection.value,
                name: searchBar.value,
            };
            const query = createQueryString(params);
            window.location.href = `/products${query}`;
        }
        return;
    }
}

export default renderHeaderComponent;