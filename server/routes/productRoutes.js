const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// পাবলিক রাউটস
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/id/:id', getProductById);

// অ্যাডমিন রাউটস
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/toggle', protect, admin, toggleProductStatus);

module.exports = router;