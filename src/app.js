require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const orderRouter = require('./routes/orders');
const cartRouter = require('./routes/cart');
const shippingRouter = require('./routes/shipping');
const staticRoutes = require('./routes/staticRoutes');

const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const authMiddleware = require('./middleware/authenticate');

app.use('/', staticRoutes);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.use(authMiddleware);
app.use('/api/products', productsRouter);
app.use('/api/category', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/shipping', shippingRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();

