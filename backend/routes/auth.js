
const express = require('express');
const {
  register,
  login,
  logout,
  verifyEmail,
  createPassword,
  resendVerification,
  updateEmail
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/verify-email/:token', verifyEmail);
router.put('/create-password', createPassword);
router.post('/resend-verification', resendVerification);
router.put('/update-email', updateEmail);

module.exports = router;
