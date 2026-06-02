const Shipping = require('../models/shipping');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllShippingOptions = async (req, res) => {
    const shippingOptions = await Shipping.find({isDeleted: false});

    const shippingOptionsFormatted = shippingOptions.map(option => {
        return {
            id: option._id,
            name: option.name,
            deliveryDays: option.deliveryDays,
            priceCents: option.priceCents
        };
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        shippingOptions: shippingOptionsFormatted
    });
};

const createShippingOption = async (req, res) => {
    const {name, deliveryDays, priceCents} = req.body;
    const shippingOption = await Shipping.create({
        name,
        deliveryDays,
        priceCents
    });

    return res.status(StatusCodes.CREATED).json({
        success: true,
        msg: 'Shipping option created successfully'
    });
};

const updateShippingOption = async (req, res) => {
    const {id} = req.params;

    const shippingOption = await Shipping.findOneAndUpdate(
        {_id: id, isDeleted: false},
        req.body,
        {runValidators: true, returnDocument: 'after'}
    );

    if(!shippingOption){
        throw new NotFoundError(`Shipping option with id ${id} not found`);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Shipping option successfully updated'
    });
};

const deleteShippingOption = async (req, res) => {
    const {id} = req.params;

    const shippingOption = await Shipping.findOne({_id: id});
    if(!shippingOption){
        throw new NotFoundError(`Shipping option with id ${id} not found`);
    }

    await shippingOption.softDelete();

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