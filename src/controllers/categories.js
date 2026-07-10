const {StatusCodes} = require('http-status-codes');
const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
    const query = req.query;
    const categories = await categoryService.getAllCategories(query);

    return res.status(StatusCodes.OK).json({
        success: true,
        categories
    });
};

const getCategory = async (req, res) => {
    const query = req.query;
    const {id} = req.params;
    
    const category = await categoryService.getCategory(id, query);

    return res.status(StatusCodes.OK).json({
        success: true,
        category
    });
};

const createCategory = async (req, res) => {
    const {name, description, isDisplayed, productIds} = req.body;
    
    const category = await categoryService.createCategory(name, description, isDisplayed, productIds);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Category created'
    });
};

const updateCategory = async (req, res) => {
    const {id} = req.params;

    const category = await categoryService.updateCategory(id, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Category updated'
    });
};

const deleteCategory = async (req, res) => {
    const {id} = req.params;
    
    const category = await categoryService.deleteCategory(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Category deleted'
    });
}

module.exports = {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};