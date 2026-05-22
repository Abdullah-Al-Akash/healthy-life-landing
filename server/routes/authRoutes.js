const express = require('express');
const { registerUser, loginUser, getCurrentUser, getAllUsers, updateUserRole, deleteUser } = require('../controllers/authController');
const { protect, admin, superAdminOnly } = require('../middleware/auth');

const router = express.Router();

// পাবলিক রাউটস (সবাই ব্যবহার করতে পারবে)
router.post('/register', registerUser);
router.post('/login', loginUser);

// প্রোটেক্টেড রাউটস (লগইন করা ইউজার)
router.get('/me', protect, getCurrentUser);

// অ্যাডমিন রাউটস (শুধু সুপার এডমিন ও ডেভেলপার)
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, superAdminOnly, updateUserRole);
router.delete('/users/:id', protect, superAdminOnly, deleteUser);

module.exports = router;