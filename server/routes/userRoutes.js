const express = require('express');
const {
  getUsers,
  getUserById,
  createAdmin,
  updateUserPermissions,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin, checkAccess } = require('../middleware/auth');

const router = express.Router();

// সব রাউটে protect + admin (শুধু সুপার এডমিন/ডেভেলপার)
router.use(protect, admin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/admin', createAdmin);
router.put('/:id/permissions', updateUserPermissions);
router.delete('/:id', deleteUser);

module.exports = router;