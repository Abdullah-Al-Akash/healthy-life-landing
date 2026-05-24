const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all blocked IPs
// @route   GET /api/ip-block
const getBlockedIPs = async (req, res) => {
  try {
    const db = getDB();
    const blockedIPs = await db.collection('ip_blacklist')
      .find({})
      .sort({ blockedAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      count: blockedIPs.length,
      blockedIPs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block an IP
// @route   POST /api/ip-block
const blockIP = async (req, res) => {
  try {
    const db = getDB();
    const { ipAddress, reason, expiresAt } = req.body;
    const user = req.user;
    
    if (!ipAddress) {
      return res.status(400).json({ success: false, message: 'IP address is required' });
    }
    
    // চেক IP already blocked
    const existingBlock = await db.collection('ip_blacklist').findOne({ ipAddress });
    if (existingBlock) {
      return res.status(400).json({ success: false, message: 'IP already blocked' });
    }
    
    const newBlock = {
      ipAddress,
      reason: reason || 'No reason provided',
      blockedBy: user._id,
      blockedByName: user.name,
      blockedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      attempts: 0,
      isActive: true,
    };
    
    await db.collection('ip_blacklist').insertOne(newBlock);
    
    // IP ব্লক হওয়ার লগ
    await db.collection('ip_logs').insertOne({
      ipAddress,
      action: 'blocked',
      reason: reason || 'No reason provided',
      blockedBy: user.name,
      timestamp: new Date(),
    });
    
    res.json({
      success: true,
      message: `IP ${ipAddress} blocked successfully`,
      block: newBlock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unblock an IP
// @route   DELETE /api/ip-block/:id
const unblockIP = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const user = req.user;
    
    const block = await db.collection('ip_blacklist').findOne({ _id: new ObjectId(id) });
    if (!block) {
      return res.status(404).json({ success: false, message: 'Block record not found' });
    }
    
    await db.collection('ip_blacklist').deleteOne({ _id: new ObjectId(id) });
    
    // IP আনব্লক হওয়ার লগ
    await db.collection('ip_logs').insertOne({
      ipAddress: block.ipAddress,
      action: 'unblocked',
      reason: `Unblocked by ${user.name}`,
      unblockedBy: user.name,
      timestamp: new Date(),
    });
    
    res.json({
      success: true,
      message: `IP ${block.ipAddress} unblocked successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get IP logs
// @route   GET /api/ip-block/logs
const getIPLogs = async (req, res) => {
  try {
    const db = getDB();
    const { limit = 100, ip } = req.query;
    
    let query = {};
    if (ip) {
      query.ipAddress = ip;
    }
    
    const logs = await db.collection('ip_logs')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();
    
    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if IP is blocked (middleware use)
const isIPBlocked = async (ipAddress) => {
  try {
    const db = getDB();
    const block = await db.collection('ip_blacklist').findOne({ 
      ipAddress,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    return !!block;
  } catch (error) {
    console.error('Error checking IP block:', error);
    return false;
  }
};

// @desc    Log IP access
const logIPAccess = async (ipAddress, url, method) => {
  try {
    const db = getDB();
    await db.collection('ip_logs').insertOne({
      ipAddress,
      url,
      method,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging IP access:', error);
  }
};

module.exports = {
  getBlockedIPs,
  blockIP,
  unblockIP,
  getIPLogs,
  isIPBlocked,
  logIPAccess,
};