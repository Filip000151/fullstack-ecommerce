const Product = require('../models/product');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllProducts = async (req, res) => {
    const products = await Product.find({isDeleted: false}).populate({
        path: 'categoryId',
        select: 'name description',
        model: 'Category'
    });
    const formatted = products.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.categoryId
    }));

    return res.status(StatusCodes.OK).json({
        success: true,
        nbHits: formatted.length,
        products: formatted
    });
};

const getProduct = async (req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId, isDeleted: false}).populate({
        path: 'categoryId',
        select: 'name description',
        model: 'Category'
    });

    if(!product){
        throw new NotFoundError(`No product found with id: ${productId}`);
    }

    const formatted = {
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.categoryId
    };

    return res.status(StatusCodes.OK).json({
        success: true,
        product: formatted
    });
}

const createProduct = async (req, res) => {
    const {name, price, categoryId} = req.body;
    const fields = {
        name,
        price,
        categoryId,
        createdBy: req.user.userId
    };
    const newProduct = await Product.create(fields);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Product created'
    });
};

const updateProduct = async (req, res) => {
    const {id: productId} = req.params;
    const {name, price, categoryId} = req.body;
    const fields = {
        name,
        price,
        categoryId
    }
    const product = await Product.findOneAndUpdate({_id: productId, isDeleted: false}, fields, {
        runValidators: true
    });

    if(!product){
        throw new NotFoundError(`No product found with id: ${productId}`);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product updated'
    });
};

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new NotFoundError(`No product found with id: ${productId}`);
    }

    await product.softDelete();

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