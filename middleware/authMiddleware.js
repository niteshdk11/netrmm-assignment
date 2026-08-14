const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token, redirect to login
  if (!token) {
    return res.redirect('/login');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.redirect('/login');
  }
};

module.exports = { protect };
