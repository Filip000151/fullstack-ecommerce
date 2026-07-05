const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Product = require('../models/product');
const Order = require('../models/order');

const publicPath = path.join(__dirname, '..', '..', 'public');

router.use('/styles', express.static(path.join(publicPath, 'styles')));
router.use('/scripts', express.static(path.join(publicPath, 'scripts')));
router.use('/images', express.static(path.join(publicPath, 'images')));

router.route('/').get((req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});
router.route('/products').get((req, res) => {
    res.sendFile(path.join(publicPath, 'products.html'));
});
router.route('/checkout').get((req, res) => {
    res.sendFile(path.join(publicPath, 'checkout.html'));
});
router.route('/orders').get((req, res) => {
    res.sendFile(path.join(publicPath, 'orders.html'));
});
router.route(['/login', '/register']).get((req, res) => {
    res.sendFile(path.join(publicPath, 'auth.html'));
});
router.route('/products/:id').get(async (req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findOne({_id: id, isDeleted: false}).populate('category', 'name _id');

        if(!product){
            return res.status(404).sendFile(path.join(publicPath, '404.html'));
        }

        const productData = {
            _id: product._id,
            name: product.name,
            priceCents: product.priceCents,
            coverImage: product.coverImage,
            images: product.images,
            category: product.category ? {_id: product.category._id, name: product.category.name} : null
        };
        const productDataJSON = JSON.stringify(productData);

        html = fs.readFileSync(path.join(publicPath, 'product.html'), 'utf-8');

        const scriptTag = `<script>window.__PRODUCT_DATA__ = ${productDataJSON};</script>`;
        html = html.replace('</head>', scriptTag + '</head>');

        res.send(html);
    }
    catch(error){
        console.error('Error loading product:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.route('/orders/:id').get(async (req, res) => {
    try{
        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).sendFile(path.join(publicPath, '404.html'));
        }

        res.sendFile(path.join(publicPath, 'order.html'), 'utf-8');
    }
    catch(error){
        console.error('Error loading order:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;