const { getDB } = require('../config/db');

// চেক IP ব্লকেড কিনা
const isIPBlocked = async (ipAddress) => {
  try {
    const db = getDB();
    const block = await db.collection('ip_blacklist').findOne({
      ipAddress,
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
    });
    return !!block;
  } catch (error) {
    console.error('Error checking IP block:', error);
    return false;
  }
};

// চেক রেট লিমিট (৩০ মিনিটে কত অর্ডার করেছে)
const checkRateLimit = async (ipAddress, limitMinutes = 30, maxOrders = 1) => {
  try {
    const db = getDB();
    const cutoffTime = new Date(Date.now() - limitMinutes * 60 * 1000);
    
    const recentOrders = await db.collection('orders').countDocuments({
      ipAddress: ipAddress,
      createdAt: { $gte: cutoffTime }
    });
    
    return {
      allowed: recentOrders < maxOrders,
      recentOrders,
      nextAvailableTime: new Date(cutoffTime.getTime() + limitMinutes * 60 * 1000)
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: true, recentOrders: 0, nextAvailableTime: null };
  }
};

// মেইন মিডলওয়্যার
const orderLimiter = async (req, res, next) => {
  try {
    const clientIp = req.realIp || req.ip;
    
    // ১. আইপি ব্লকেড কিনা চেক
    const isBlocked = await isIPBlocked(clientIp);
    if (isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your IP has been blocked. Please contact support.',
        blocked: true
      });
    }
    
    // ২. রেট লিমিট চেক (৩০ মিনিটে ১ টি অর্ডার)
    const rateLimit = await checkRateLimit(clientIp, 30, 1);
    
    if (!rateLimit.allowed) {
      const waitMinutes = Math.ceil((rateLimit.nextAvailableTime - new Date()) / (1000 * 60));
      return res.status(429).json({
        success: false,
        message: `You have already placed an order recently. Please wait ${waitMinutes} minutes before placing another order.`,
        rateLimited: true,
        waitMinutes: waitMinutes,
        nextAvailableTime: rateLimit.nextAvailableTime
      });
    }
    
    next();
  } catch (error) {
    console.error('Order limiter error:', error);
    next();
  }
};

module.exports = orderLimiter;