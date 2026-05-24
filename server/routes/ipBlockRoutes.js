const express = require('express');
const {
  getBlockedIPs,
  blockIP,
  unblockIP,
  getIPLogs,
} = require('../controllers/ipBlockController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// সব রাউট অ্যাডমিন এবং প্রটেক্টেড
router.use(protect, admin);

router.get('/', getBlockedIPs);
router.post('/', blockIP);
router.delete('/:id', unblockIP);
router.get('/logs', getIPLogs);

module.exports = router;