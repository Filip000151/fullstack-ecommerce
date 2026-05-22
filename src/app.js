require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

//routes

const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const authMiddleware = require('./middleware/authenticate');


app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

app.use(express.static('../public'));
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

