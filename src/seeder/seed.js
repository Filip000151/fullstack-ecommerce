require('dotenv').config();

const jsonProducts = require('./products.json');
const jsonCategories = require('./categories.json');
const jsonShipping = require('./shipping.json');

const Product = require('../models/product');
const Category = require('../models/category');
const Shipping = require('../models/shipping');
const User = require('../models/user');

const connectDB = require('../db/connect');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        await Category.deleteMany();
        await Product.deleteMany();
        await Shipping.deleteMany();
        await User.deleteMany();

        const adminUser = await User.create({
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'secret',
            role: 'admin'
        });

        await Category.create(jsonCategories);
    
        const categories = await Category.find({});

        for(let i = 0; i < jsonProducts.length; i++){
            if(i < 9)
                jsonProducts[i].categoryId = categories[0]._id;
            else
                jsonProducts[i].categoryId = categories[1]._id;
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