const Category = require('../models/category');
const {NotFoundError} = require('../errors');
const mongoose = require('mongoose');

class CategoryService{
    async getAllCategories(){
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

        return categories;
    }

    async getCategory(categoryId){
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

        return category;
    }

    async createCategory(name, description){
        const newCategory = await Category.create({
            name,
            description
        });
        return newCategory;
    }

    async updateCategory(categoryId, data){
        const category = await Category.findOneAndUpdate(
            {_id: categoryId}, 
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