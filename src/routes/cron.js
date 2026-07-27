const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const CRON_SECRET = process.env.CRON_SECRET;

router.route('/update-order-statuses').post(async (req, res) => {
    const authHeader = req.headers['x-cron-secret'];
    if(authHeader !== CRON_SECRET){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false
        });
    }
    try {
        const result = await orderService.updateAllOrderStatuses();
        console.log(`[CRON] Updated ${result.updatedCount}/${result.total} orders at ${new Date().toISOString()}`);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error(`[CRON] failed: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false
        });
    }
});

router.route('/ping').get((req, res) => res.status(StatusCodes.NO_CONTENT).send());

module.exports = router;