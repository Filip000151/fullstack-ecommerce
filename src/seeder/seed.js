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
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });

        await Category.create(jsonCategories);
    
        const categories = await Category.find({});
        
        const categoryMap = {};
        for(const c of categories){
            categoryMap[c.name] = c._id;
        }

        const allProducts = [];
        for(const [categoryName, products] of Object.entries(jsonProducts)){
            const categoryId = categoryMap[categoryName];

            for(const product of products){
                allProducts.push({
                    ...product,
                    category: categoryId,
                    createdBy: adminUser
                });
            }
        }

        await Product.create(allProducts);

        await Shipping.create(jsonShipping);

        console.log('Seeding successfull!');
        
        process.exit(1);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

start();