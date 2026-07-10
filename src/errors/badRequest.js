const {StatusCodes} = require('http-status-codes');
const CustomError = require('./customError');

class BadRequestError extends CustomError{
    constructor(message, code){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.code = code;
    }
}

module.exports = BadRequestError;