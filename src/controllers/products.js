const {StatusCodes} = require('http-status-codes');
const productService = require('../services/productService');

const getAllProducts = async (req, res) => {
    const query = req.query;
    const {products, pagination} = await productService.getAllProducts(query);

    return res.status(StatusCodes.OK).json({
        success: true,
        nbHits: products.length,
        products,
        pagination
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
    const {name, priceCents, categoryId, isFeatured} = req.body;
    const files = req.files;
    const {userId} = req.user;

    const product = await productService.createProduct({name, priceCents, categoryId, isFeatured}, files, userId);
    
    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Product created',
        product
    });
};

const updateProduct = async (req, res) => {
    const {id: productId} = req.params;
    const {name, priceCents, categoryId, currentImages, isFeatured} = req.body;
    const files = req.files;
    
    const product = await productService.updateProduct(productId, {name, priceCents, categoryId, currentImages, isFeatured}, files);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product updated',
        product
    });
};

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params;
    
    const product = await productService.deleteProduct(productId);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Product deleted',
        product
    });
}


module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};