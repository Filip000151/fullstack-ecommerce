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
const staticRouter = require('./routes/static');

const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const authMiddleware = require('./middleware/authenticate');

const scheduler = require('./services/scheduler');

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/products', authMiddleware, productsRouter);
app.use('/api/category', authMiddleware, categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use('/api/shipping', authMiddleware, shippingRouter);

app.use(staticRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            scheduler.start();
        });
    } catch (error) {
        console.log(error);
    }
}

start();