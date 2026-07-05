const Category = require('../models/category');
const Product = require('../models/product');
const {NotFoundError} = require('../errors');
const mongoose = require('mongoose');

class CategoryService{
    async getAllCategories(query){
        const {isDisplayed, withProducts} = query;

        const queryObject = {};

        let categories;
        if(isDisplayed){
            queryObject.isDisplayed = isDisplayed === 'true';
        }

        if(withProducts && withProducts === 'true'){
            categories = await Category.aggregate([
                {$match: queryObject},
                {
                    $lookup: {
                        from: 'products',
                        let: {categoryProductsId: '$_id'},
                        pipeline: [
                            {$match: {$expr: {$eq: ['$category', '$$categoryProductsId']}}},
                            {$project: {
                                createdAt: 0,
                                createdBy: 0,
                                isFeatured: 0,
                                isDeleted: 0,
                                deletedAt: 0,
                                updatedAt: 0,
                                images: 0,
                                category: 0
                            }}
                        ],
                        as: 'products'
                    }
                },
                {$project: {
                    isDisplayed: 0
                }}
            ]);
        }
        else{
            categories = await Category.find(queryObject).select('-isDisplayed');
        }

        return categories;
    }

    async getCategory(categoryId, query){
        const withProducts = query.withProducts === 'true';

        const category = await Category.findById(categoryId).select('-isDisplayed');
        if(withProducts){
            const products = await Product.find({category: categoryId}).select('-images -isFeatured -category -createdBy -isDeleted -deletedAt -createdAt -updatedAt');
            return {
                ...category.toObject(),
                products
            }
        }

        return category;
    }

    async createCategory(name, description, isDisplayed){
        const newCategory = await Category.create({
            name,
            description,
            isDisplayed
        });
        return newCategory;
    }

    async updateCategory(categoryId, data){
        const category = await Category.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(categoryId)}, 
            data, 
            {
                runValidators: true,
                returnDocument: 'after'
            }
        );
    
        if(!category){
            throw new NotFoundError('No category found with id: ' + categoryId);
        }

        return category;
    }

    async deleteCategory(categoryId){
        const category = await Category.findOneAndDelete({_id: categoryId});
        
        if(!category){
            throw new NotFoundError('No category found with id: ' + categoryId);
        }

        return category;
    }
}


module.exports = new CategoryService();