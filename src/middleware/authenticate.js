const {UnauthorizedError} = require('../errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if(!accessToken){
        req.user = {
            role: 'guest',
            isGuest: true
        };
        return next();
    }

    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = {
        userId: payload.userId,
        role: payload.role,
        name: payload.name,
        isGuest: false
    };
    next();
};

module.exports = authenticate;