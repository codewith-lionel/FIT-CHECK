const express = require('express');
const { auth } = require('../middleware/auth');
const { sensitiveLimiter } = require('../middleware/rateLimit');
const { getCart, addToCart, removeFromCart, updateQuantity } = require('../controllers/cartController');

const router = express.Router();

router.use(sensitiveLimiter);
router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/quantity', auth, updateQuantity);
router.delete('/remove', auth, removeFromCart);

module.exports = router;
