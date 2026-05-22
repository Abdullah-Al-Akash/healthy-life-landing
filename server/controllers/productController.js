const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection('products').find({ isActive: true }).toArray();
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
const getProductBySlug = async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/id/:id
const getProductById = async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const db = getDB();
    const { slug } = req.body;
    
    // চেক slug ইতিমধ্যে আছে কিনা
    const existingProduct = await db.collection('products').findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }
    
    const newProduct = {
      ...req.body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('products').insertOne(newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: { ...newProduct, _id: result.insertedId },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = {
      ...req.body,
      updatedAt: new Date(),
    };
    
    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );
    
    res.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product active status (Admin only)
// @route   PATCH /api/products/:id/toggle
const toggleProductStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: !product.isActive, updatedAt: new Date() } }
    );
    
    res.json({
      success: true,
      message: `Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
};