class Router{
    constructor(routes){
        this.routes = routes;
        this.currentPath = window.location.pathname;
        this.contentElement = document.body;
        this.currentQuery = window.location.search;

        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, {replace: true});
        });

        this.navigate(this.currentPath, {replace: true});
    }

    async navigate(path, data = {}){
        const [pathname, queryString] = path.split('?');
        const queryParams = new URLSearchParams(queryString || '');

        let route = this.routes[pathname];
        let params = {};

        if(!route){
            for (const [routePath, routeConfig] of Object.entries(this.routes)) {
                if (routePath.includes(':')) {
                    const pattern = routePath.replace(/:[^\s/]+/g, '([^/]+)');
                    const regex = new RegExp(`^${pattern}$`);
                    const match = path.match(regex);
                    
                    if (match) {
                        const paramNames = routePath.match(/:[^\s/]+/g) || [];
                        paramNames.forEach((name, index) => {
                            params[name.slice(1)] = match[index + 1];
                        });
                        route = routeConfig;
                        break;
                    }
                }
            }
        }

        if(!route){
            route = this.routes['/404'] || this.routes['/'];
        }

        this.currentQuery = queryString ? `?${queryString}` : '';
        this.currentPath = path;

        const fullPath = pathname + this.currentQuery;
        if (!data.replace) {
            window.history.pushState({}, '', fullPath);
        } else {
            window.history.replaceState({}, '', fullPath);
        }

        Array.from(this.contentElement.children).forEach(element => {
            if (!element.classList.contains('toast-container')) {
                element.remove();
            }
        });

        const pageModule = await route.import();
        const page = pageModule.default;
        
        await page(params);
        
        if (route.title) {
            document.title = route.title;
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export default Router;