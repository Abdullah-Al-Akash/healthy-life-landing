const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const db = getDB();
    const { range = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    // ডেট রেঞ্জ ফিল্টার
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      switch (range) {
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          dateFilter = { createdAt: { $gte: weekAgo } };
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          dateFilter = { createdAt: { $gte: monthAgo } };
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          dateFilter = { createdAt: { $gte: yearAgo } };
          break;
        default:
          const monthAgoDefault = new Date(now.setMonth(now.getMonth() - 1));
          dateFilter = { createdAt: { $gte: monthAgoDefault } };
      }
    }
    
    // অর্ডার স্ট্যাটাস কাউন্ট
    const totalOrders = await db.collection('orders').countDocuments(dateFilter);
    const pendingOrders = await db.collection('orders').countDocuments({ ...dateFilter, orderStatus: 'pending' });
    const approvedOrders = await db.collection('orders').countDocuments({ ...dateFilter, orderStatus: 'approved' });
    const deliveredOrders = await db.collection('orders').countDocuments({ ...dateFilter, orderStatus: 'delivered' });
    const cancelledOrders = await db.collection('orders').countDocuments({ ...dateFilter, orderStatus: 'cancelled' });
    
    // টোটাল রেভিনিউ (শুধু ডেলিভারড অর্ডারের)
    const revenueAgg = await db.collection('orders').aggregate([
      { $match: { ...dateFilter, orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]).toArray();
    const totalRevenue = revenueAgg[0]?.total || 0;
    
    // প্রোডাক্ট কাউন্ট
    const totalProducts = await db.collection('products').countDocuments();
    
    // কাস্টমার কাউন্ট
    const totalCustomers = await db.collection('customers').countDocuments();
    
    // ডেইলি অর্ডার ট্রেন্ড (লাস্ট 7 দিন)
    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await db.collection('orders').countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      dailyOrders.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: count
      });
    }
    
    // অর্ডার স্ট্যাটাস ডিস্ট্রিবিউশন
    const orderStatusDistribution = [
      { label: 'Pending', value: pendingOrders, color: '#f59e0b' },
      { label: 'Approved', value: approvedOrders, color: '#3b82f6' },
      { label: 'Delivered', value: deliveredOrders, color: '#10b981' },
      { label: 'Cancelled', value: cancelledOrders, color: '#ef4444' }
    ];
    
    // টপ কাস্টমার (অ্যামাউন্ট অনুযায়ী)
    const topCustomersByAmount = await db.collection('customers')
      .find({})
      .sort({ totalSpent: -1 })
      .limit(5)
      .toArray();
    
    // টপ কাস্টমার (অর্ডার কাউন্ট অনুযায়ী)
    const topCustomersByOrders = await db.collection('customers')
      .find({})
      .sort({ totalOrders: -1 })
      .limit(5)
      .toArray();
    
    // টপ প্রোডাক্ট (অর্ডার থেকে এগ্রিগেট)
    const topProductsAgg = await db.collection('orders').aggregate([
      { $match: dateFilter },
      { $group: {
        _id: '$productTitle',
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    const topProductsByCount = topProductsAgg.map(p => ({
      name: p._id,
      count: p.count,
      revenue: p.revenue
    }));
    
    const topProductsByRevenue = [...topProductsAgg]
      .sort((a, b) => b.revenue - a.revenue)
      .map(p => ({
        name: p._id,
        count: p.count,
        revenue: p.revenue
      }));
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
      },
      dailyOrders,
      orderStatusDistribution,
      topCustomers: {
        byAmount: topCustomersByAmount,
        byOrders: topCustomersByOrders
      },
      topProducts: {
        byCount: topProductsByCount,
        byRevenue: topProductsByRevenue
      }
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics summary
// @route   GET /api/orders/stats/summary
const getOrderStatsSummary = async (req, res) => {
  try {
    const db = getDB();
    
    const totalOrders = await db.collection('orders').countDocuments();
    const pendingOrders = await db.collection('orders').countDocuments({ orderStatus: 'pending' });
    const approvedOrders = await db.collection('orders').countDocuments({ orderStatus: 'approved' });
    const deliveredOrders = await db.collection('orders').countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await db.collection('orders').countDocuments({ orderStatus: 'cancelled' });
    
    const revenueAgg = await db.collection('orders').aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]).toArray();
    const totalRevenue = revenueAgg[0]?.total || 0;
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getOrderStatsSummary,
};