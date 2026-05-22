const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {register, adminRegister, login, logout, getLoggedUser} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/admin-register').post(authenticate, authorize('admin'), adminRegister);
router.route('/login').post(login);
router.route('/logout').post(authenticate, logout);
router.route('/').get(authenticate, getLoggedUser);

module.exports = router;