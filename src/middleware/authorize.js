const {StatusCodes} = require('http-status-codes');
const {ForbiddenError, UnauthorizedError} = require('../errors');

const authorize = (...roles) => {
    return (req, res, next) => {
        const {role, isGuest} = req.user;

        if(isGuest && !roles.includes('guest')){
            throw new UnauthorizedError('Please log in');
        }

        if(!roles || roles.length === 0){
            return next();
        }

        if(!roles.includes(role)){
            throw new ForbiddenError('You do not have permission to perform this action');
        }
        next();
    };
};

module.exports = authorize;