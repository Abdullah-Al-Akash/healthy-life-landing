const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { setCustomPermissions } = require('../config/permissions');

// @desc    Get all users (Super Admin & Developer only)
const getUsers = async (req, res) => {
  try {
    const db = getDB();
    
    // ডেভেলপার ও সুপার এডমিন সব ইউজার দেখতে পাবে
    let query = {};
    
    // শুধু সুপার এডমিন ডেভেলপার দেখতে পাবে, অন্যরা দেখবে না
    if (req.user.role !== 'developer' && req.user.role !== 'super_admin') {
      query = { isHidden: { $ne: true } };
    }
    
    const users = await db.collection('users').find(query).project({ password: 0 }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
const getUserById = async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // ডেভেলপার তথ্য শুধু ডেভেলপার ও সুপার এডমিন দেখতে পাবে
    if (user.isHidden && req.user.role !== 'developer' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new admin user (Super Admin only)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;
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
      role: 'admin',
      isHidden: false,
      hasCustomPermissions: !!permissions,
      customPermissions: permissions || null,
      createdBy: req.user._id,
      createdAt: new Date(),
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    res.status(201).json({
      _id: result.insertedId,
      name,
      email,
      role: 'admin',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user permissions (Super Admin only)
const updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { routes, methods } = req.body;
    const db = getDB();
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // ডেভেলপার বা সুপার এডমিনের পারমিশন পরিবর্তন করা যাবে না
    if (user.role === 'developer' || user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot change permissions of this user' });
    }
    
    await setCustomPermissions(id, routes, methods);
    
    res.json({ message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Super Admin only)
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
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createAdmin,
  updateUserPermissions,
  deleteUser,
};