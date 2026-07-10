const Shipping = require('../models/shipping');
const {NotFoundError} = require('../errors');

class ShippingService{
    async getAllShippingOptions(){
        const shippingOptions = await Shipping.find({isDeleted: false}).sort('priceCents');
        
        const shippingOptionsFormatted = shippingOptions.map(option => {
            return {
                _id: option._id,
                name: option.name,
                deliveryDays: option.deliveryDays,
                priceCents: option.priceCents
            };
        });

        return shippingOptionsFormatted;
    }

    async getShippingOption(shippingId){
        const shippingOption = await Shipping.findOne({_id: shippingId});

        if(!shippingOption){
            throw new NotFoundError(`Shipping option with id ${shippingId} not found`);
        }

        return shippingOption;
    }

    async createShippingOption(name, deliveryDays, priceCents){
        const shippingOption = await Shipping.create({
            name,
            deliveryDays,
            priceCents
        });
        return shippingOption;
    }

    async updateShippingOption(shippingId, data){
        const shippingOption = await Shipping.findOneAndUpdate(
            {_id: shippingId, isDeleted: false},
            data,
            {runValidators: true, returnDocument: 'after'}
        );

        if(!shippingOption){
            throw new NotFoundError(`Shipping option with id ${shippingId} not found`);
        }

        return shippingOption;
    }

    async deleteShippingOption(shippingId){
        const shippingOption = await Shipping.findOne({_id: shippingId});
        if(!shippingOption){
            throw new NotFoundError(`Shipping option with id ${shippingId} not found`);
        }
    
        await shippingOption.softDelete();

        return shippingOption;
    }
}


module.exports = new ShippingService();