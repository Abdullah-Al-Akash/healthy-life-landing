const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  createAdmin, // ← ইম্পোর্ট করো
  updateUserRole,
  deleteUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect, admin, superAdminOnly } = require("../middleware/auth");

const router = express.Router();

// পাবলিক রাউটস
router.post("/register", registerUser);
router.post("/login", loginUser);

// প্রোটেক্টেড রাউটস
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// অ্যাডমিন রাউটস (শুধু সুপার এডমিন ও ডেভেলপার)
router.get("/users", protect, admin, getAllUsers);
router.post("/users/admin", protect, admin, createAdmin); // ← এই লাইন
router.put("/users/:id/role", protect, superAdminOnly, updateUserRole);
router.delete("/users/:id", protect, superAdminOnly, deleteUser);

module.exports = router;
