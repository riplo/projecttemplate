var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User model
 * TODO add more information about user (general user vs content curator,
 * screen name, prof pic, etc)
 * NOTE userType will determine what privileges users have and what views they
 * can see: user, admin, curator
 */
module.exports = mongoose.model('User', {
  name: String,
  username: String,
  password: String,
  userType: String,
  profilePicture: String,
  location: String,
  bio: String,
  content: {
    type: Schema.Types.ObjectId, ref: 'User',
  }
});
