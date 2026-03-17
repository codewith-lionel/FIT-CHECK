const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { tryOn } = require('../controllers/tryOnController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.fields([{ name: 'userImage', maxCount: 1 }, { name: 'clothImage', maxCount: 1 }]), tryOn);

module.exports = router;
