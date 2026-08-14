require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Routes
app.use('/', authRoutes);

// Home route redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
