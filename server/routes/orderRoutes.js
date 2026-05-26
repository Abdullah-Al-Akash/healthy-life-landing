const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  sendToCourier,
  updateTracking,
  getOrderStats,
  searchOrders,
  getOrderByOrderId,
  updateCustomerInfo
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const orderLimiter = require('../middleware/orderLimiter');

const router = express.Router();

// পাবলিক
router.post('/', orderLimiter, createOrder);
router.get('/search', searchOrders);
router.get('/track/:orderId', getOrderByOrderId);

// অ্যাডমিন
router.get('/', protect, admin, getOrders);
router.get('/stats/summary', protect, admin, getOrderStats);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/courier', protect, admin, sendToCourier);
router.put('/:id/tracking', protect, admin, updateTracking);
router.put('/:id/customer', protect, admin, updateCustomerInfo);

module.exports = router;