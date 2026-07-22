import Router from './router/index.js';
import routes from './router/routes.js';

const router = new Router(routes);
window.router = router;

document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-navigate]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
            router.navigate(href);
        }
    }
});