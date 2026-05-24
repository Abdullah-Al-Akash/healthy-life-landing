const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Create or update customer from order
const updateOrCreateCustomer = async (orderData) => {
  try {
    const db = getDB();
    const { phone, name, address } = orderData.customerInfo;
    
    if (!phone) return null;
    
    const existingCustomer = await db.collection('customers').findOne({ phone });
    
    const orderHistoryItem = {
      orderId: orderData.orderId,
      productTitle: orderData.productTitle,
      totalPrice: orderData.totalPrice,
      orderStatus: orderData.orderStatus,
      orderDate: new Date(),
    };
    
    if (existingCustomer) {
      // আপডেট existing customer
      await db.collection('customers').updateOne(
        { phone },
        { 
          $set: {
            name: name || existingCustomer.name,
            address: address || existingCustomer.address,
            totalOrders: existingCustomer.totalOrders + 1,
            totalSpent: existingCustomer.totalSpent + orderData.totalPrice,
            lastOrderDate: new Date(),
            updatedAt: new Date(),
          },
          $push: { orderHistory: orderHistoryItem }
        }
      );
    } else {
      // ক্রিয়েট new customer
      const newCustomer = {
        phone,
        name: name || '',
        address: address || '',
        totalOrders: 1,
        totalSpent: orderData.totalPrice,
        firstOrderDate: new Date(),
        lastOrderDate: new Date(),
        orderHistory: [orderHistoryItem],
        isActive: true,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await db.collection('customers').insertOne(newCustomer);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
};

// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const db = getDB();
    const { search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { phone: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ]
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const customers = await db.collection('customers')
      .find(query)
      .sort({ lastOrderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('customers').countDocuments(query);
    
    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer by phone
// @route   GET /api/customers/:phone
const getCustomerByPhone = async (req, res) => {
  try {
    const db = getDB();
    const customer = await db.collection('customers').findOne({ phone: req.params.phone });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer order history
// @route   GET /api/customers/:phone/orders
const getCustomerOrders = async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('orders')
      .find({ 'customerInfo.phone': req.params.phone })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer status (active/inactive)
// @route   PUT /api/customers/:id/status
const updateCustomerStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { isActive } = req.body;
    const user = req.user;
    
    await db.collection('customers').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isActive, 
          updatedAt: new Date(),
          ...(isActive === false && { 
            notes: `Customer deactivated by ${user.name} on ${new Date().toLocaleString()}` 
          })
        } 
      }
    );
    
    res.json({ success: true, message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer info
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { name, email, address, notes } = req.body;
    
    await db.collection('customers').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, email, address, notes,
          updatedAt: new Date(),
        } 
      }
    );
    
    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
    
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateOrCreateCustomer,
  getCustomers,
  getCustomerByPhone,
  getCustomerOrders,
  updateCustomerStatus,
  updateCustomer,
  deleteCustomer,
};