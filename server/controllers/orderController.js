const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { sendOrderToCourier } = require('../services/courierService');

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
const createOrder = async (req, res) => {
  try {
    const db = getDB();
    
    const orderId = generateOrderId();
    
    // রিয়েল আইপি নেওয়া
    const clientIp = req.realIp || req.ip || 'unknown';
    
    const newOrder = {
      orderId,
      ...req.body,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      ipAddress: clientIp,
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
    
    // ========== 🔥 এখানে কাস্টমার তৈরি/আপডেট করার কোড যোগ করো ==========
    // কাস্টমার তৈরি বা আপডেট করার ফাংশন কল
    const { updateOrCreateCustomer } = require('./customerController');
    await updateOrCreateCustomer(newOrder);
    // ====================================================================
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: { ...newOrder, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Create order error:', error);
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


const sendToCourier = async (req, res) => {
  console.log("📨 sendToCourier called with params:", req.params);
  console.log("📨 Request body:", req.body);
  
  try {
    const db = getDB();
    const { id } = req.params;
    const { provider } = req.body;
    const user = req.user;

    console.log(`🚚 Sending order ${id} to ${provider} courier...`);

    const validProviders = ['steadfast', 'pathao'];
    if (!validProviders.includes(provider)) {
      console.log("❌ Invalid provider:", provider);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid courier provider' 
      });
    }

    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) {
      console.log("❌ Order not found:", id);
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    console.log("✅ Order found:", order.orderId);

    // কুরিয়ার API তে অর্ডার পাঠানো
    console.log("📤 Calling courier API...");
    const courierResponse = await sendOrderToCourier(provider, {
      orderId: order.orderId,
      customerInfo: order.customerInfo,
      totalPrice: order.totalPrice,
      productTitle: order.productTitle,
    });

    console.log("📥 Courier API Response:", courierResponse);

    if (!courierResponse.success) {
      console.log("❌ Courier API failed:", courierResponse.message);
      return res.status(400).json({
        success: false,
        message: courierResponse.message,
        error: courierResponse.error,
      });
    }

    // কুরিয়ার তথ্য সেভ
    const courierInfo = {
      provider,
      trackingId: courierResponse.trackingId,
      trackingUrl: courierResponse.trackingUrl,
      sentAt: new Date(),
      sentBy: user._id,
      sentByName: user.name,
      apiResponse: courierResponse.fullResponse,
    };

    const historyEntry = {
      status: 'approved',
      note: `Order sent to ${provider} courier. Tracking ID: ${courierResponse.trackingId}`,
      changedBy: user._id,
      changedByName: user.name,
      timestamp: new Date(),
    };

    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          courierInfo,
          orderStatus: 'approved',
          updatedAt: new Date(),
        },
        $push: { history: historyEntry }
      }
    );

    console.log("✅ Order updated successfully in database");

    res.json({
      success: true,
      message: courierResponse.message,
      courierInfo: {
        provider,
        trackingId: courierResponse.trackingId,
        trackingUrl: courierResponse.trackingUrl,
      }
    });

  } catch (error) {
    console.error("❌ Send to courier error:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      error: error.toString(),
    });
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
    
    if (q.startsWith('ORD-')) {
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

// @desc    Update customer info (Admin only)
const updateCustomerInfo = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { customerInfo } = req.body;
    const user = req.user;

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          customerInfo,
          updatedAt: new Date()
        },
        $push: {
          history: {
            status: 'info_updated',
            note: `Customer information updated by ${user.name}`,
            changedBy: user._id,
            changedByName: user.name,
            timestamp: new Date()
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, message: 'Customer info updated' });
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
  getOrderByOrderId,
  updateCustomerInfo
};