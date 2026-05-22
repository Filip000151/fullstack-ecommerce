const CustomError = require('./customError');
const BadRequestError = require('./badRequest');
const NotFoundError = require('./notFound');
const UnauthorizedError = require('./unauthorized');
const ForbiddenError = require('./forbidden');


module.exports = {
    CustomError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
};