const {StatusCodes} = require('http-status-codes');
const shippingService = require('../services/shippingService');

const getAllShippingOptions = async (req, res) => {
    const shippingOptions = await shippingService.getAllShippingOptions();

    return res.status(StatusCodes.OK).json({
        success: true,
        shippingOptions
    });
};

const createShippingOption = async (req, res) => {
    const {name, deliveryDays, priceCents} = req.body;
    
    const shippingOption = await shippingService.createShippingOption(name, deliveryDays, priceCents);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Shipping option created successfully'
    });
};

const updateShippingOption = async (req, res) => {
    const {id} = req.params;

    const shippingOption = await shippingService.updateShippingOption(id, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Shipping option successfully updated'
    });
};

const deleteShippingOption = async (req, res) => {
    const {id} = req.params;

    const deletedShippingOption = await shippingService.deleteShippingOption(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Shipping option deleted successfully'
    });
};

module.exports = {
    getAllShippingOptions,
    createShippingOption,
    updateShippingOption,
    deleteShippingOption
};