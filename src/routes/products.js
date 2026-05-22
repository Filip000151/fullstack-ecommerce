const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/products');

router.route('/')
    .get(getAllProducts)
    .post(authMiddleware, authorize('admin'), createProduct);

router.route('/:id')
    .get(getProduct)
    .patch(authMiddleware, authorize('admin'), updateProduct)
    .delete(authMiddleware, authorize('admin'), deleteProduct);

module.exports = router;