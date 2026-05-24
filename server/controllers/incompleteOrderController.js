const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Create incomplete order
// @route   POST /api/incomplete-orders
const createIncompleteOrder = async (req, res) => {
  try {
    const db = getDB();
    const { phone, name, address, productId, productTitle, offerPrice, deliveryArea, note, step } = req.body;
    
    // আগের ইনকমপ্লিট অর্ডার আছে কিনা চেক করো
    const existingOrder = await db.collection('incomplete_orders').findOne({ phone, productId });
    
    if (existingOrder) {
      // আপডেট করো
      await db.collection('incomplete_orders').updateOne(
        { _id: existingOrder._id },
        { 
          $set: { 
            name, address, note, step, 
            updatedAt: new Date(),
            lastStep: step,
            updateCount: (existingOrder.updateCount || 0) + 1
          } 
        }
      );
      return res.json({ success: true, incompleteId: existingOrder._id });
    } else {
      // নতুন ইনকমপ্লিট অর্ডার তৈরি
      const newIncomplete = {
        phone,
        name,
        address,
        productId,
        productTitle,
        offerPrice,
        deliveryArea: deliveryArea || 'inside_dhaka',
        note,
        step,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'incomplete',
      };
      
      const result = await db.collection('incomplete_orders').insertOne(newIncomplete);
      res.status(201).json({ success: true, incompleteId: result.insertedId });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete incomplete order
// @route   DELETE /api/incomplete-orders/:id
const deleteIncompleteOrder = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    await db.collection('incomplete_orders').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all incomplete orders
// @route   GET /api/incomplete-orders
const getIncompleteOrders = async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('incomplete_orders')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();
    
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createIncompleteOrder, deleteIncompleteOrder, getIncompleteOrders };