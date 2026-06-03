const Product = require('../models/product');
const {NotFoundError, BadRequestError} = require('../errors');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');

class ProductService{
    async getAllProducts(query){
        const {name, page, limit, numericFilters, sort, category, isFeatured} = query;
        const queryObject = {isDeleted: false};

        if(name){
            queryObject.name = {$regex: name, $options: 'i'};
        }
        if(category){
            queryObject.categoryId = category;
        }
        if(isFeatured){
            queryObject.isFeatured = isFeatured === 'true' ? true : false;
        }
        if(numericFilters){
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte'
            };
            const regEx = /\b(<|>|>=|=|<\<=)\b/g;
            let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
            const options = ['priceCents'];
            const [field, operator, value] = filters.split('-');
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)};
            }
        }

        let result = Product.find(queryObject);

        if(sort){
            const sortList = sort.split(',').join(' ');
            result = result.sort(sortList);
        }
        else{
            result = result.sort('createdAt');
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        result = result.skip(skip).limit(limitNumber);

        const products = await result;

        const formatted = products.map(product => ({
            id: product._id,
            name: product.name,
            priceCents: product.priceCents,
            coverImage: product.coverImage,
            images: product.images,
            category: product.categoryId
        }));

        return formatted;
    }

    async getProduct(productId){
        const product = await Product.findOne({_id: productId, isDeleted: false}).populate({
            path: 'categoryId',
            select: 'name',
            model: 'Category'
        });
    
        if(!product){
            throw new NotFoundError(`No product found with id: ${productId}`);
        }
    
        const formatted = {
            id: product._id,
            name: product.name,
            priceCents: product.priceCents,
            coverImage: product.coverImage,
            images: product.images,
            category: product.categoryId
        };

        return formatted;
    }
    async createProduct(productData, files, userId){
        const imagePaths = files['images']?.map(image => {
            return `images/uploads/${image.filename}`;
        }) || [];

        try{
            productData.isFeatured = productData.isFeatured === 'true' ? true : false;
            productData.priceCents = Number(productData.priceCents);

            const coverImagePath = files?.coverImage?.[0] 
                ? `images/uploads/${files?.coverImage?.[0]?.filename}`
                : null;
        
            const fields = {
                ...productData,
                coverImage: coverImagePath,
                images: imagePaths,
                createdBy: userId
            };
            const newProduct = await Product.create(fields);
            return newProduct;
        } catch (error) {
            this.deleteFiles(files);
            throw error;
        }
    }

    async updateProduct(productId, updateData, files){
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const product = await Product.findOne({isDeleted: false, _id: productId}).session(session);

            if(!product){
                throw new NotFoundError(`No product found with id: ${productId}`);
            }

            product.name = updateData.name;
            product.priceCents = Number(updateData.priceCents);
            product.categoryId = updateData.categoryId;
            product.isFeatured = updateData.isFeatured === 'true' ? true : false;

            let imagesToKeep;

            if(updateData.currentImages && !Array.isArray(updateData.currentImages)){
                imagesToKeep = [updateData.currentImages];
            }
            else if(!updateData.currentImages){
                imagesToKeep = [];
            }
            else{
                imagesToKeep = updateData.currentImages;
            }

            for(const image of imagesToKeep){
                if(!product.images.includes(image)){
                    throw new BadRequestError('Current image does not belong to this product.');
                }
            }

            const imagesToDelete = product.images.filter(oldImage => !imagesToKeep.includes(oldImage));

            const finalImages = [...imagesToKeep];

            if(files?.coverImage?.[0]){
                imagesToDelete.push(product.coverImage);
                const coverImagePath = `images/uploads/${files['coverImage'][0].filename}`;
                product.coverImage = coverImagePath;
            }

            if(files?.images){
                for(const image of files.images){
                    const imagePath = `images/uploads/${image.filename}`;
                    finalImages.push(imagePath);
                }
            }

            product.images = finalImages;

            await product.save({session});
            await session.commitTransaction();

            for(const imagePath of imagesToDelete){
                this.deleteFile(imagePath);
            }

            return product;
        }
        catch(error){
            await session.abortTransaction();
            this.deleteFiles(files);
            throw error;
        }
        finally{
            session.endSession();
        }
    }

    async deleteProduct(productId){
        const product = await Product.findOne({_id: productId});
        if(!product){
            throw new NotFoundError(`No product found with id: ${productId}`);
        }
    
        await product.softDelete();

        return product;
    }
    
    async deleteFile(filePath){
        if(!filePath) return;

        const fullPath = path.join(__dirname, '..', '..', 'public', filePath);

        try {
            await fs.unlink(fullPath);
        } catch (error) {
            console.error(`Failed to delete file: ${fullPath}`, error.message);
        } 
    }

    async deleteFiles(files){
        if(!files) return;
    
        const allFiles = Object.values(files).flat();
        for(const file of allFiles){
            if(file.path){
                await fs.unlink(file.path);
            }
        }
    }
}

module.exports = new ProductService();