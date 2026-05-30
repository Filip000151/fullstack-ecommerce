const Category = require('../models/category');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');
const mongoose = require('mongoose');

const getAllCategories = async (req, res) => {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'categoryId',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: {$size: '$products'}
            }
        },
        {
            $sort: {name: 1}
        }
    ]);

    return res.status(StatusCodes.OK).json({
        success: true,
        categories
    });
};

const getCategory = async (req, res) => {
    const {id: categoryId} = req.params;
    const category = await Category.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(categoryId)}
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'categoryId',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: {$size: '$products'}
            }
        }
    ]);

    if(!category || category.length === 0){
        throw new NotFoundError('No category found with id: ' + categoryId);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        category
    });
};

const createCategory = async (req, res) => {
    const {name, description} = req.body;
    const newCategory = await Category.create({
        name,
        description
    });
    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Category created'
    });
};

const updateCategory = async (req, res) => {
    const {id: categoryId} = req.params;

    const category = await Category.findOneAndUpdate({_id: categoryId}, req.body, {
        runValidators: true,
        returnDocument: 'after'
    });

    if(!category){
        throw new NotFoundError('No category found with id: ' + categoryId);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Category updated'
    });
};

const deleteCategory = async (req, res) => {
    const {id: categoryId} = req.params;
    const category = await Category.findOneAndDelete({_id: categoryId});

    if(!category){
        throw new NotFoundError('No category found with id: ' + categoryId);
    }

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