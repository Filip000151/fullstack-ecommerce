const Category = require('../models/category');
const {NotFoundError} = require('../errors');
const mongoose = require('mongoose');

class CategoryService{
    async getAllCategories(){
        const categories = await Category.find({}).select('_id name description isDisplayed');
        return categories;
    }

    async getCategory(categoryId){
        const categories = await Category.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(categoryId)}
            },
            {
                $lookup: {
                    from: 'products',
                    let: {categoryId: '$_id'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {$eq: ['$categoryId', '$$categoryId']},
                                isDeleted: false
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                priceCents: 1,
                                coverImage: 1
                            }
                        }
                    ],
                    as: 'products'
                }
            },
            {
                $addFields: {
                    productCount: {$size: '$products'}
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    isDisplayed: 1,
                    products: 1,
                    productCount: 1
                }
            }
        ]);
    
        if(!categories || categories.length === 0){
            throw new NotFoundError('No category found with id: ' + categoryId);
        }

        return categories[0];
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