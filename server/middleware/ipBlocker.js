const { isIPBlocked, logIPAccess } = require('../controllers/ipBlockController');

const ipBlocker = async (req, res, next) => {
  try {
    // রিয়েল আইপি পাওয়া
    let clientIp = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   req.ip;
    
    // IPv6 লোকালহোস্ট কে IPv4 তে কনভার্ট
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
      clientIp = '127.0.0.1';
    }
    
    // একাধিক IP থাকলে প্রথমটা নাও
    if (clientIp && clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }
    
    req.realIp = clientIp;
    
    // আইপি ব্লকেড কিনা চেক
    const isBlocked = await isIPBlocked(clientIp);
    
    if (isBlocked) {
      // ব্লকেড আইপির অ্যাক্সেস লগ
      await logIPAccess(clientIp, req.originalUrl, req.method);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your IP has been blocked.',
        blocked: true,
      });
    }
    
    // নরমাল অ্যাক্সেস লগ (অপশনাল)
    // await logIPAccess(clientIp, req.originalUrl, req.method);
    
    next();
  } catch (error) {
    console.error('IP Blocker error:', error);
    next();
  }
};

module.exports = ipBlocker;