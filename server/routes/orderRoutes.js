const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  sendToCourier,
  updateTracking,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// পাবলিক
router.post('/', createOrder);

// অ্যাডমিন
router.get('/', protect, admin, getOrders);
router.get('/stats/summary', protect, admin, getOrderStats);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/courier', protect, admin, sendToCourier);
router.put('/:id/tracking', protect, admin, updateTracking);

module.exports = router;