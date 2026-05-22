const {StatusCodes} = require('http-status-codes');
const CustomError = require('./customError');

class UnauthorizedError extends CustomError{
    constructor(message, code){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
        this.code = code || 'TOKEN_MISSING';
    }
}

module.exports = UnauthorizedError;