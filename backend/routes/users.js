
const express = require('express');
const {
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);
router.put('/password', protect, updatePassword);

module.exports = router;
