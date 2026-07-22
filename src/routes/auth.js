const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {register, login, logout, getCurrentUser, refreshAccessToken, requestGuestId} = require('../controllers/auth');
const rateLimiter = require('express-rate-limit');

const loginLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many login attempts, please try again later.'
});
const registerLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many registration attempts, please try again later.',
});

router.route('/refresh').post(refreshAccessToken);
router.route('/guest').post(requestGuestId);

router.use(authenticate);
router.route('/register').post(registerLimiter, register);
router.route('/login').post(loginLimiter, login);
router.route('/').get(getCurrentUser);
router.route('/logout').post(authorize(), logout);


module.exports = router;