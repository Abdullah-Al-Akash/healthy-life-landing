const express = require('express');
const {
  getCustomers,
  getCustomerByPhone,
  getCustomerOrders,
  updateCustomerStatus,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, admin, getCustomers);
router.get('/:phone', protect, admin, getCustomerByPhone);
router.get('/:phone/orders', protect, admin, getCustomerOrders);
router.put('/:id/status', protect, admin, updateCustomerStatus);
router.put('/:id', protect, admin, updateCustomer);
router.delete('/:id', protect, admin, deleteCustomer);

module.exports = router;