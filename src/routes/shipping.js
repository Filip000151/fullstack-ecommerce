const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {getAllShippingOptions,
    getShippingOption,
    createShippingOption,
    updateShippingOption,
    deleteShippingOption} = require('../controllers/shipping');

router.route('/')
    .get(getAllShippingOptions)
    .post(authorize('admin'), createShippingOption);

router.use(authorize('admin'));
router.route('/:id')
    .get(getShippingOption)
    .patch(updateShippingOption)
    .delete(deleteShippingOption);

    
module.exports = router;