export const routes = {
    '/': {
        title: 'Home',
        import: () => import('../pages/home.js')
    },
    '/products': {
        title: 'Products',
        import: () => import('../pages/products.js')
    },
    '/products/:id': {
        title: 'Product Details',
        import: () => import('../pages/product.js')
    },
    '/checkout': {
        title: 'Checkout',
        import: () => import('../pages/checkout.js')
    },
    '/orders': {
        title: 'My Orders',
        import: () => import('../pages/orders.js')
    },
    '/orders/:id': {
        title: 'Order Details',
        import: () => import('../pages/order.js')
    },
    '/login': {
        title: 'Login',
        import: () => import('../pages/auth.js')
    },
    '/register': {
        title: 'Register',
        import: () => import('../pages/auth.js')
    },
    '/dashboard': {
        title: 'Dashboard',
        import: () => import('../pages/dashboard.js')
    },
    '/dashboard/products': {
        title: 'Dashboard Products',
        import: () => import('../pages/dashboardCrud.js')
    },
    '/dashboard/orders': {
        title: 'Dashboard Orders',
        import: () => import('../pages/dashboardCrud.js')
    },
    '/dashboard/categories': {
        title: 'Dashboard Categories',
        import: () => import('../pages/dashboardCrud.js')
    },
    '/dashboard/shipping': {
        title: 'Dashboard Shipping Options',
        import: () => import('../pages/dashboardCrud.js')
    },
    '/404': {
        title: 'Page Not Found',
        import: () => import('../pages/404.js')
    }
};

export default routes;