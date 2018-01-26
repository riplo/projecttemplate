// Import models
const User = require('../models/user');

// Helper method to check if a user is an admin or a curator
const notCuratorOrAdmin = (req) => {
  // Isolate userId from Backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }

  // No user is logged in
  if (!userId) {
    return 'You must be logged in to post.';
  }

  // Search for user in Mongo
  User.findById(userId, (errUser, user) => {
    // If error finding user
    if (errUser) {
      return errUser.message;
    // User isn't admin or curator
    } else if (user.userType !== 'admin' && user.userType !== 'curator') {
      return 'General users cannot create articles.';
    }
    // Return no error
    return false;
  });
};

module.exports = {
  notCuratorOrAdmin
};
