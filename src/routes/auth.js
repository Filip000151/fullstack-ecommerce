const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {register, adminRegister, login, logout, getLoggedUser, refreshAccessToken} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/refresh').post(refreshAccessToken);

router.use(authenticate);
router.route('/').get(authorize(), getLoggedUser);
router.route('/logout').post(authorize(), logout);
router.route('/admin-register').post(authorize('admin'), adminRegister);


module.exports = router;