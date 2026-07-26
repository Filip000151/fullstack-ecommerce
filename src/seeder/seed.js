require('dotenv').config();

const jsonProducts = require('./products.json');
const jsonCategories = require('./categories.json');
const jsonShipping = require('./shipping.json');

const Product = require('../models/product');
const Category = require('../models/category');
const Shipping = require('../models/shipping');
const User = require('../models/user');
const Order = require('../models/order');
const RefreshToken = require('../models/refreshToken');
const Cart = require('../models/cart');

const connectDB = require('../db/connect');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        await Category.deleteMany();
        await Product.deleteMany();
        await Shipping.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();
        await RefreshToken.deleteMany();
        await Cart.deleteMany();


        const adminUser = await User.create({
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'secret',
            role: 'admin'
        });

        await Category.create(jsonCategories);
    
        const categories = await Category.find({});
        
        let categoryIndex = 0;
        for(let i = 0; i < jsonProducts.length; i++){
            if(i === 7 || i === 13 || i === 19 || i === 25 || i === 30){
                categoryIndex++;
            }
            jsonProducts[i].category = categories[categoryIndex]._id;
        }

        const products = jsonProducts.map(product => {
            return {
                ...product,
                createdBy: adminUser._id
            };
        });

        await Product.create(products);

        await Shipping.create(jsonShipping);

        console.log('Seeding successfull!');
        
        process.exit(1);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

start();