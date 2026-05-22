const {UnauthorizedError} = require('../errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if(!accessToken){
        throw new UnauthorizedError('User not logged in.');
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = {
            userId: payload.userId,
            role: payload.role,
            name: payload.name
        };
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;