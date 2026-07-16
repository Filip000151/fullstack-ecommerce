const Product = require('../models/product');
const {NotFoundError, BadRequestError} = require('../errors');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');

class ProductService{
    async getAllProducts(query){
        const {name, page, limit, maxPrice, minPrice, sort, category, isFeatured} = query;
        const queryObject = {
            isDeleted: false
        };

        if(name){
            queryObject.name = {$regex: name, $options: 'i'};
        }
        if(category){
            if(category === 'uncategorised') queryObject.category = null;
            else queryObject.category = category;
        }
        if(isFeatured !== undefined){
            queryObject.isFeatured = isFeatured === 'true';
        }
        if(maxPrice || minPrice){
            queryObject['priceCents'] = {};
        }
        if(maxPrice){
            const value = Number(maxPrice);
            if(isNaN(value) || value < 0){
                throw new BadRequestError(`Value needs to be a valid positive number: ${maxPrice}`);
            }
            queryObject['priceCents'].$lte = Number(maxPrice);
        }
        if(minPrice){
            const value = Number(minPrice);
            if(isNaN(value) || value < 0){
                throw new BadRequestError(`Value needs to be a valid positive number: ${minPrice}`);
            }
            queryObject['priceCents'].$gte = Number(minPrice);
        }
        
        const total = await Product.countDocuments(queryObject);
        let result = Product.find(queryObject);

        if(sort && sort.trim()){
            const sortList = sort.split(',').join(' ');
            result = result.sort(sortList + ' _id');
        }
        else{
            result = result.sort('createdAt _id');
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        result = result.skip(skip).limit(limitNumber);

        const products = await result;

        const formatted = products.map(product => ({
            _id: product._id,
            name: product.name,
            priceCents: product.priceCents,
            coverImage: product.coverImage,
            images: product.images,
            category: product.category
        }));

        return {
            products: formatted,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber * limitNumber < total,
                hasPrevPage: pageNumber > 1
            }
        };
    }

    async getProduct(productId){
        const product = await Product.findOne({_id: productId, isDeleted: false}).populate('category', '_id name');
    
        if(!product){
            throw new NotFoundError(`No product found with id: ${productId}`);
        }

        return product;
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
            product.category = updateData.categoryId;
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

            await product.populate('category', '_id name');

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
        const normalizedPath = path.normalize(filePath);
        const pathParts = normalizedPath.split(path.sep);
        if(pathParts.includes('seeded')) return;

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