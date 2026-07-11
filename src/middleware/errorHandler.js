const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    customError = {
        success: false,
        msg: err.message,
        code: err.code
    }
    customError.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors)
            .map(item => item.message)
            .join(' ');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if(err.name === 'CastError'){
        customError.msg = `No item found with id: ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    if(err.code === 11000){
        let msg = '';
        for(const [key, value] of Object.entries(err.keyValue)){
            msg += `${key}: "${value}" already exists. `;
        }
        customError.msg = msg;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if(err.name === 'TokenExpiredError'){
        customError.msg = 'Token expired. Please log in.';
        customError.code = 'TOKEN_EXPIRED';
        customError.statusCode = StatusCodes.UNAUTHORIZED;
    }
    if(err.code === 'INVALID_TOKEN'){
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }

    return res.status(customError.statusCode).json(customError);
};

module.exports = errorHandler;