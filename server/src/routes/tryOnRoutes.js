const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { sensitiveLimiter } = require('../middleware/rateLimit');
const { tryOn } = require('../controllers/tryOnController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(sensitiveLimiter);
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'userImage', maxCount: 1 },
    { name: 'clothImage', maxCount: 1 },
  ]),
  tryOn
);

module.exports = router;
