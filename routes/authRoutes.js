const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  showSignup,
  signup,
  showWelcome,
  verifyEmail,
  showLogin,
  login,
  logout,
  showDashboard
} = require('../controllers/authController');

// Public routes
router.get('/signup', showSignup);
router.post('/signup', signup);
router.get('/welcome', showWelcome);
router.post('/verify-email', verifyEmail);
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/dashboard', protect, showDashboard);

module.exports = router;
