const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const CRON_SECRET = process.env.CRON_SECRET;

router.route('/update-order-statuses').post(async (req, res) => {
    const authHeader = req.headers['x-cron-secret'];
    if(authHeader !== CRON_SECRET){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            msg: 'Unauthorized'
        });
    }
    try {
        const result = await orderService.updateAllOrderStatuses();
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Order statuses updated successfully',
            updatedCount: result.updatedCount,
            total: result.total
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: 'Cron job failed'
        });
    }
});

module.exports = router;