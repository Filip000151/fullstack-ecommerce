const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');

router.use('/styles', express.static(path.join(__dirname, '..', '..', 'public', 'styles')));
router.use('/scripts', express.static(path.join(__dirname, '..', '..', 'public', 'scripts')));
router.use('/images', express.static(path.join(__dirname, '..', '..', 'public', 'images')));

router.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});
router.route('/products').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'products.html'));
});
router.route('/checkout').get((req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'checkout.html'));
});
router.route('/products/:id').get(async (req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findOne({_id: id, isDeleted: false}).populate('categoryId', 'name _id');

        if(!product){
            return res.status(404).sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
        }

        const productData = {
            _id: product._id,
            name: product.name,
            priceCents: product.priceCents,
            coverImage: product.coverImage,
            images: product.images,
            category: product.categoryId ? {_id: product.categoryId._id, name: product.categoryId.name} : null
        };
        const productDataJSON = JSON.stringify(productData);

        html = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'product.html'), 'utf-8');

        const scriptTag = `<script>window.__PRODUCT_DATA__ = ${productDataJSON};</script>`;
        html = html.replace('</head>', scriptTag + '</head>');

        res.send(html);
    }
    catch(error){
        console.error('Error loading product:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;