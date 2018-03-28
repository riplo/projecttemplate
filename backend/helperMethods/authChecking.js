/**
 * Helper methods to ensure varying levels of authentication on the backend
 */

// Import models
const User = require('../models/user');

// Helper method to check if a user is an admin or a curator
const CuratorOrAdminCheck = (req, cb) => {
  // Isolate userId from Backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }

  // No user is logged in
  if (!userId) {
    cb({
      success: false,
      error: 'You must be logged in.',
    });
    return;
  }

  // Search for user in Mongo
  User.findById(userId, (errUser, user) => {
    // If error finding user
    if (errUser) {
      cb({
        success: false,
        error: errUser.message,
      });
      return;
    // User isn't admin or curator
    } else if (user.userType !== 'admin' && user.userType !== 'curator') {
      cb({
        success: false,
        error: 'General users do not have this privilege.',
      });
      return;
    }
    // Return no error
    cb({
      success: true,
      error: '',
    });
    return;
  });
};

// Helper method to check if a user is an admin
const AdminCheck = (req, cb) => {
  let userId = '';
  // Assign userId to user in backend
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // If user doesn't exist
  if (!userId) {
    cb({
      success: false,
      error: 'Must be logged in.',
    });
    return;
  }
  // Find the admin in Mongo
  User.findById(userId, (errAdmin, admin) => {
    // Error finding admin
    if (errAdmin) {
      cb({
        success: false,
        error: errAdmin.message,
      });
      return;
    // Can't find admin
    } else if (!admin) {
      cb({
        success: false,
        error: 'User not found.',
      });
      return;
    // User isn't am admin
    } else if (admin.userType !== 'admin') {
      cb({
        success: false,
        error: 'You must be an admin.',
      });
      return;
    }
    // If no errors
    cb({
      success: true,
      error: '',
    });
    return;
  });
};

// Helper method to check if a user is logged in
const UserCheck = (req, cb) => {
  // Isolate userId from backend
  let userId = "";
  if (req.session.passport) {
    userId = req.session.passport.user;
  }
  // User is not logged in
  if (!userId) {
    cb({
      success: false,
      error: 'Must be logged in.',
    });
    return;
  }
  // User is logged in
  cb({
    success: true,
    error: '',
  });
  return;
};

module.exports = {
  CuratorOrAdminCheck,
  AdminCheck,
  UserCheck,
};
