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

    // চেক ইউজার ইতিমধ্যে আছে কিনা
    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // পাসওয়ার্ড হ্যাশ
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // নিউ ইউজার ক্রিয়েট
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

    // ইউজার খুঁজে বের করো
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // পাসওয়ার্ড মিলাও
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // লগইন সফল
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
    
    // ডেভেলপার ইউজার হাইড করো (সুপার এডমিন ছাড়া)
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

// @desc    Update user role (Super Admin only)
// @route   PUT /api/auth/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const db = getDB();

    // ভ্যালিড রোল চেক
    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // ইউজার খুঁজে বের করো
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ডেভেলপারের রোল পরিবর্তন করা যাবে না
    if (user.role === 'developer') {
      return res.status(403).json({ message: 'Cannot change developer role' });
    }

    // রোল আপডেট
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

    // ডেভেলপার বা সুপার এডমিন ডিলিট করা যাবে না
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

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
};