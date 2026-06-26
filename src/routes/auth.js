const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {register, login, logout, getLoggedUser, refreshAccessToken, requestGuestId} = require('../controllers/auth');

router.route('/refresh').post(refreshAccessToken);
router.route('/guest').post(requestGuestId);

router.use(authenticate);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/').get(authorize(), getLoggedUser);
router.route('/logout').post(authorize(), logout);


module.exports = router;