const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide a type']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide a contact number']
  },
  address: {
    type: String
  },
  country: {
    type: String,
    required: [true, 'Please provide a country']
  },
  contactMode: {
    type: String,
    required: [true, 'Please provide a contact mode']
  },
  noOfDevices: {
    type: Number,
    required: [true, 'Please provide number of devices']
  },
  subdomainName: {
    type: String,
    required: [true, 'Please provide a subdomain name']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String
  },
  otpExpires: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
