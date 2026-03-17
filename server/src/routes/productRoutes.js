const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');
const { sensitiveLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.use(sensitiveLimiter);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

module.exports = router;
