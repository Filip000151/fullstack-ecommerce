const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {getAllShippingOptions,
    createShippingOption,
    updateShippingOption,
    deleteShippingOption} = require('../controllers/shipping');

router.use(authenticate);
router.use(authorize('admin'));

router.route('/')
    .get(getAllShippingOptions)
    .post(createShippingOption);

router.route('/:id')
    .patch(updateShippingOption)
    .delete(deleteShippingOption);

module.exports = router;