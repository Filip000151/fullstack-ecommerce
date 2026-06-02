const Product = require('../models/product');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors');
const fs = require('fs');
const productService = require('../services/productService');

const getAllProducts = async (req, res) => {
    const products = await productService.getAllProducts();

    return res.status(StatusCodes.OK).json({
        success: true,
        nbHits: products.length,
        products
    });
};

const getProduct = async (req, res) => {
    const {id: productId} = req.params;
    
    const product = await productService.getProduct(productId);

    return res.status(StatusCodes.OK).json({
        success: true,
        product
    });
}

const createProduct = async (req, res) => {
    const {name, priceCents, categoryId} = req.body;
    const files = req.files;
    const {userId} = req.user;

    const newProduct = await productService.createProduct({name, priceCents, categoryId}, files, userId);
    
    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Product created'
    });
};

const updateProduct = async (req, res) => {
    const {id: productId} = req.params;
    const {name, priceCents, categoryId, currentImages} = req.body;
    const files = req.files;
    
    const product = await productService.updateProduct(productId, {name, priceCents, categoryId, currentImages}, files);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product updated'
    });
};

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params;
    
    const product = await productService.deleteProduct(productId);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product deleted'
    });
}


module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};