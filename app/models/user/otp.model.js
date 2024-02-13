const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Set an expiration time for the OTP document (e.g., 5 minutes)
  },
});

const OTPModel = mongoose.model('OTPDetails', otpSchema);

module.exports = OTPModel;
