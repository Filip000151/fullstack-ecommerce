const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate');
const {register, login, logout, getLoggedUser} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(authMiddleware, logout);
router.route('/').get(authMiddleware, getLoggedUser);

module.exports = router;