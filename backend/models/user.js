// Import frameworks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema contains pertinent information about the user
const userSchema = new Schema({
  first: String,
  last: String,
  username: String,
  password: String,
  userType: String,
  facebookId: String,
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  accountVerified: { type: Boolean, default: false },
  verificationToken: String,
});

/**
 * User model using schema
 */
module.exports = mongoose.model('User', userSchema);
