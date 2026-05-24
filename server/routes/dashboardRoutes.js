const express = require('express');
const { getDashboardStats, getOrderStatsSummary } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/orders/summary', protect, admin, getOrderStatsSummary);

module.exports = router;