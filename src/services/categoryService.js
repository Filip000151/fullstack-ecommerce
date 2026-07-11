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
                            {$match: {
                                $expr: {$eq: ['$category', '$$categoryProductsId']},
                                isDeleted: false
                            }},
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

        const category = await Category.findById(categoryId);
        if(withProducts){
            const products = await Product.find({category: categoryId, isDeleted: false}).select('-images -isFeatured -category -createdBy -isDeleted -deletedAt -createdAt -updatedAt');
            return {
                ...category.toObject(),
                products
            }
        }

        return category;
    }

    async createCategory(name, description, isDisplayed, productIds){
        const newCategory = await Category.create({
            name,
            description,
            isDisplayed
        });
        if(productIds && productIds.length > 0) await newCategory.addProducts(productIds);
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
        await category.updateProducts(data.productIds);
        const products = await Product.find({category: categoryId, isDeleted: false})
            .select('-images -isFeatured -category -createdBy -isDeleted -deletedAt -createdAt -updatedAt');
    
        if(!category){
            throw new NotFoundError('No category found with id: ' + categoryId);
        }

        return {
            ...category.toObject(),
            products
        };
    }

    async deleteCategory(categoryId){
        const category = await Category.findOne({_id: categoryId});
        
        if(!category){
            throw new NotFoundError('No category found with id: ' + categoryId);
        }

        await category.removeProducts();
        await category.deleteOne();

        return category;
    }
}


module.exports = new CategoryService();