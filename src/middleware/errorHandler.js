const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    customError = {
        success: false,
        msg: err.message,
        code: err.code
    }
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;


    return res.status(statusCode).json({err, customError});
};

module.exports = errorHandler;