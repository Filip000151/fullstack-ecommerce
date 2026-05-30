const express = require('express');
const router = express.Router();
const {getAllCategories, getCategory, createCategory, updateCategory, deleteCategory} = require('../controllers/categories');
const authorize = require('../middleware/authorize');

router.route('/')
    .get(getAllCategories)
    .post(authorize('admin'), createCategory);

router.route('/:id')
    .get(getCategory)
    .patch(authorize('admin'), updateCategory)
    .delete(authorize('admin'), deleteCategory);


module.exports = router;