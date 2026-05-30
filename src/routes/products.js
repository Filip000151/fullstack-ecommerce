const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/products');

router.route('/')
    .get(getAllProducts)
    .post(authorize('admin'), createProduct);

router.route('/:id')
    .get(getProduct)
    .patch(authorize('admin'), updateProduct)
    .delete(authorize('admin'), deleteProduct);

    
module.exports = router;