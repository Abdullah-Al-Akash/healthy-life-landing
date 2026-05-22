const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// অর্ডার আইডি জেনারেট
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

// @desc    Create order
// @desc    Create order
const createOrder = async (req, res) => {
  try {
    const db = getDB();
    
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // রিয়েল আইপি নেওয়া
    const clientIp = req.realIp || req.ip || 'unknown';
    
    const newOrder = {
      orderId,
      ...req.body,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      ipAddress: clientIp,  // রিয়েল আইপি সেভ হবে
      userAgent: req.headers['user-agent'],
      history: [{
        status: 'pending',
        note: 'Order created',
        changedBy: null,
        changedByName: 'System',
        timestamp: new Date(),
      }],
      courierInfo: {
        provider: null,
        trackingId: null,
        trackingUrl: null,
        sentAt: null,
        sentBy: null,
        sentByName: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('orders').insertOne(newOrder);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: { ...newOrder, _id: result.insertedId },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
const getOrders = async (req, res) => {
  try {
    const db = getDB();
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('orders').countDocuments(query);
    
    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
const getOrderById = async (req, res) => {
  try {
    const db = getDB();
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status, note } = req.body;
    const user = req.user;
    
    const validStatuses = ['pending', 'approved', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // ইতিহাসে যোগ
    const historyEntry = {
      status,
      note: note || `Status changed from ${order.orderStatus} to ${status}`,
      changedBy: user._id,
      changedByName: user.name,
      timestamp: new Date(),
    };
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          orderStatus: status,
          updatedAt: new Date(),
        },
        $push: { history: historyEntry }
      }
    );
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send to courier (Admin only)
const sendToCourier = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { provider, trackingId, trackingUrl } = req.body;
    const user = req.user;
    
    const validProviders = ['steadfast', 'pathao'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ message: 'Invalid courier provider' });
    }
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // কুরিয়ার তথ্য সেভ
    const courierInfo = {
      provider,
      trackingId: trackingId || null,
      trackingUrl: trackingUrl || null,
      sentAt: new Date(),
      sentBy: user._id,
      sentByName: user.name,
    };
    
    // ইতিহাসে যোগ
    const historyEntry = {
      status: order.orderStatus,
      note: `Order sent to ${provider} courier. Tracking ID: ${trackingId || 'N/A'}`,
      changedBy: user._id,
      changedByName: user.name,
      timestamp: new Date(),
    };
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          courierInfo,
          updatedAt: new Date(),
        },
        $push: { history: historyEntry }
      }
    );
    
    res.json({
      success: true,
      message: `Order sent to ${provider} courier successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tracking info (Admin only)
const updateTracking = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { trackingId, trackingUrl } = req.body;
    const user = req.user;
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const updateData = {
      'courierInfo.trackingId': trackingId,
      'courierInfo.trackingUrl': trackingUrl,
      updatedAt: new Date(),
    };
    
    // ইতিহাসে যোগ
    const historyEntry = {
      status: order.orderStatus,
      note: `Tracking info updated. ID: ${trackingId}`,
      changedBy: user._id,
      changedByName: user.name,
      timestamp: new Date(),
    };
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: updateData,
        $push: { history: historyEntry }
      }
    );
    
    res.json({
      success: true,
      message: 'Tracking info updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const db = getDB();
    
    const pendingOrders = await db.collection('orders').countDocuments({ orderStatus: 'pending' });
    const approvedOrders = await db.collection('orders').countDocuments({ orderStatus: 'approved' });
    const deliveredOrders = await db.collection('orders').countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await db.collection('orders').countDocuments({ orderStatus: 'cancelled' });
    const totalOrders = await db.collection('orders').countDocuments();
    
    // টোটাল রেভিনিউ
    const revenueAgg = await db.collection('orders').aggregate([
      { $match: { paymentStatus: 'paid', orderStatus: 'delivered' } },
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search orders by orderId or phone
// @route   GET /api/orders/search?q=:query
const searchOrders = async (req, res) => {
  try {
    const db = getDB();
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an order ID or phone number' 
      });
    }
    
    let query = {};
    
    // চেক করো কোয়েরি টা অর্ডার আইডি নাকি ফোন নাম্বার
    if (q.startsWith('ORD-')) {
      // অর্ডার আইডি দিয়ে খোঁজা
      query = { orderId: q };
      const order = await db.collection('orders').findOne(query);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }
      
      return res.json({
        success: true,
        type: 'single',
        order: order
      });
      
    } else {
      // ফোন নাম্বার দিয়ে খোঁজা (একাধিক অর্ডার আসতে পারে)
      const phoneRegex = new RegExp(q, 'i');
      query = { 'customerInfo.phone': phoneRegex };
      
      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      if (orders.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No orders found for this phone number' 
        });
      }
      
      return res.json({
        success: true,
        type: 'multiple',
        count: orders.length,
        orders: orders
      });
    }
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get order by orderId (public)
// @route   GET /api/orders/track/:orderId
const getOrderByOrderId = async (req, res) => {
  try {
    const db = getDB();
    const { orderId } = req.params;
    
    const order = await db.collection('orders').findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  sendToCourier,
  updateTracking,
  getOrderStats,
  searchOrders,
  getOrderByOrderId
};