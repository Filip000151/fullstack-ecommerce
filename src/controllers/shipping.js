const Shipping = require('../models/shipping');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllShippingOptions = async (req, res) => {
    const shippingOptions = await Shipping.find({});

    return res.status(StatusCodes.OK).json({
        success: true,
        shippingOptions
    });
};

const createShippingOption = async (req, res) => {
    const {name, deliveryDays, price, isActive} = req.body;
    const shippingOption = await Shipping.create({
        name,
        deliveryDays,
        price,
        isActive
    });

    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Shipping option created successfully',
        shippingOption
    });
};

const updateShippingOption = async (req, res) => {
    const {id} = req.params;

    const shippingOption = await Shipping.findOneAndUpdate(
        {_id: id},
        req.body,
        {runValidators: true, new: true}
    );

    if(!shippingOption){
        throw new NotFoundError(`Shipping option with id ${id} not found`);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Shipping option successfully updated',
        shippingOption
    });
};

const deleteShippingOption = async (req, res) => {
    const {id} = req.params;

    const shippingOption = await Shipping.findOneAndDelete({_id: id});

    if(!shippingOption){
        throw new NotFoundError(`Shipping option with id ${id} not found`);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Shipping option deleted successfully',
        shippingOption
    });
};

module.exports = {
    getAllShippingOptions,
    createShippingOption,
    updateShippingOption,
    deleteShippingOption
};