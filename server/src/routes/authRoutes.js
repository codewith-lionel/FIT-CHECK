const express = require('express');
const { register, login, profile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.use(authLimiter);
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, profile);

module.exports = router;
