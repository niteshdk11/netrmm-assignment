const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

// Setup nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @desc    Show signup page
// @route   GET /signup
const showSignup = (req, res) => {
  res.render('signup', { error: null });
};

// @desc    Register new user
// @route   POST /signup
const signup = async (req, res) => {
  try {
    const {
      firstName, lastName, companyName, type, email,
      contactNumber, address, country, contactMode,
      noOfDevices, subdomainName, password
    } = req.body;

    // Validation
    if (!firstName || !lastName || !companyName || !email || !password || !contactNumber || !country || !contactMode || !noOfDevices || !subdomainName || !type) {
      return res.render('signup', {
        error: 'Please fill in all required fields'
      });
    }

    if (password.length < 6) {
      return res.render('signup', {
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('signup', {
        error: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      companyName,
      type,
      email,
      contactNumber,
      address,
      country,
      contactMode,
      noOfDevices,
      subdomainName,
      password: hashedPassword,
      isVerified: false,
      verificationOTP: otp,
      otpExpires: otpExpires
    });

    // Send email with OTP
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify your NetRMM Account',
        text: `Your OTP for NetRMM account verification is: ${otp}\nThis OTP will expire in 10 minutes.`
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // We still redirect to welcome page even if email fails, so they can try to resend later if we implement it,
      // but ideally we should alert them. For now, just continue.
    }

    // Redirect to welcome page
    res.redirect(`/welcome?email=${encodeURIComponent(user.email)}`);
  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', {
      error: 'An error occurred during registration'
    });
  }
};

// @desc    Show welcome page
// @route   GET /welcome
const showWelcome = (req, res) => {
  const email = req.query.email || '';
  res.render('welcome', { email, error: null, success: null });
};

// @desc    Verify Email with OTP
// @route   POST /verify-email
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.render('welcome', { email, error: 'Email and OTP are required', success: null });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('welcome', { email, error: 'User not found', success: null });
    }

    if (user.isVerified) {
      return res.redirect('/login');
    }

    if (user.verificationOTP !== otp) {
      return res.render('welcome', { email, error: 'Invalid OTP', success: null });
    }

    if (user.otpExpires < new Date()) {
      return res.render('welcome', { email, error: 'OTP has expired', success: null });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.redirect('/login?verified=true');
  } catch (error) {
    console.error('Verify email error:', error);
    res.render('welcome', { email: req.body.email, error: 'An error occurred during verification', success: null });
  }
};

// @desc    Show login page
// @route   GET /login
const showLogin = (req, res) => {
  const verified = req.query.verified;
  let successMsg = null;
  if (verified === 'true') {
    successMsg = 'Email verified successfully. You can now log in.';
  }
  res.render('login', { error: null, success: successMsg });
};

// @desc    Login user
// @route   POST /login
const login = async (req, res) => {
  try {
    const { email, password, subdomain } = req.body;

    // Validation
    if (!email || !password) {
      return res.render('login', {
        error: 'Please fill in all required fields',
        success: null
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        error: 'Email does not exist',
        success: null
      });
    }

    // Ensure user is verified
    if (!user.isVerified) {
      return res.render('login', {
        error: 'Please verify your email before logging in',
        success: null
      });
    }

    // Optional: check subdomain if it's required to match
    // if (subdomain && user.subdomainName !== subdomain) {
    //   return res.render('login', { error: 'Invalid subdomain for this account', success: null });
    // }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid email or password',
        success: null
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      error: 'An error occurred during login',
      success: null
    });
  }
};

// @desc    Logout user
// @route   GET /logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// @desc    Show dashboard
// @route   GET /dashboard
const showDashboard = (req, res) => {
  res.render('dashboard', { user: req.user });
};

module.exports = {
  showSignup,
  signup,
  showWelcome,
  verifyEmail,
  showLogin,
  login,
  logout,
  showDashboard
};
