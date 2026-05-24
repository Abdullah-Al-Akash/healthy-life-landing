const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// টোকেন জেনারেট
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = getDB();

    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        name,
        email,
        role: 'user',
      },
      token: generateToken(result.insertedId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();

    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { password: 0 } }
    );
    
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    
    let query = {};
    if (req.user.role !== 'super_admin' && req.user.role !== 'developer') {
      query = { isHidden: { $ne: true } };
    }
    
    const users = await db.collection('users')
      .find(query)
      .project({ password: 0 })
      .toArray();
    
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== 🔥 নতুন ফাংশন যোগ করো ==========

// @desc    Create new admin user (Super Admin only)
// @route   POST /api/auth/users/admin
const createAdmin = async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, role } = req.body;
    
    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        _id: result.insertedId,
        name,
        email,
        role: role || 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================

// @desc    Update user role (Super Admin only)
// @route   PUT /api/auth/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const db = getDB();

    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'developer') {
      return res.status(403).json({ message: 'Cannot change developer role' });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Super Admin only)
// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'developer' || user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete this user' });
    }

    await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const db = getDB();
    const { name, email } = req.body;
    const userId = req.user._id;
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, email, updatedAt: new Date() } }
    );
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const db = getDB();
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  createAdmin,        // ← যোগ করো
  updateUserRole,
  deleteUser,
  updateProfile,
  changePassword,
};