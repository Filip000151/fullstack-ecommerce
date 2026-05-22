const express = require('express');
const router = express.Router();
const {getAllCategories, getCategory, createCategory, updateCategory, deleteCategory} = require('../controllers/categories');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(getAllCategories)
    .post(authenticate, authorize('admin'), createCategory);

router.route('/:id')
    .get(getCategory)
    .patch(authenticate, authorize('admin'), updateCategory)
    .delete(authenticate, authorize('admin'), deleteCategory);


module.exports = router;