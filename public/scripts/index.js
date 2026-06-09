import getHeader from "./components/header.js";

const container = document.querySelector('.container');

const header = getHeader();
container.appendChild(header);