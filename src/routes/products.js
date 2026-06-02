const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/products');
const upload = require('../middleware/upload');

router.route('/')
    .get(getAllProducts)
    .post(
        authorize('admin'), 
        upload.fields([{name: 'coverImage', maxCount: 1}, {name: 'images', maxCount: 8}]), 
        createProduct);

router.route('/:id')
    .get(getProduct)
    .patch(
        authorize('admin'), 
        upload.fields([{name: 'coverImage', maxCount: 1}, {name: 'images', maxCount: 8}]), 
        updateProduct)
    .delete(authorize('admin'), deleteProduct);

    
module.exports = router;