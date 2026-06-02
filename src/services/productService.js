const Product = require('../models/product');
const {NotFoundError, BadRequestError} = require('../errors');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');

class ProductService{
    async getAllProducts(){
        const products = await Product.find({isDeleted: false}).populate({
            path: 'categoryId',
            select: 'name',
            model: 'Category'
        });

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

        
        const coverImagePath = files?.coverImage?.[0] 
            ? `images/uploads/${files?.coverImage?.[0]?.filename}`
            : null;
    
        const fields = {
            ...productData,
            coverImage: coverImagePath,
            images: imagePaths,
            createdBy: userId
        };
        try {
            const newProduct = await Product.create(fields);
            return newProduct;
        } catch (error) {
            deleteFiles(files);
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
            product.priceCents = updateData.priceCents;
            product.categoryId = updateData.categoryId;

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