const express = require('express');
const { createIncompleteOrder, deleteIncompleteOrder, getIncompleteOrders } = require('../controllers/incompleteOrderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createIncompleteOrder);
router.get('/', protect, admin, getIncompleteOrders);
router.delete('/:id', deleteIncompleteOrder);

module.exports = router;