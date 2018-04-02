/**
 * Handles all backend routes for users - changing information and accessing profiles
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const uuid = require('uuid-v4');

const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');

// Export the following methods for routing
module.exports = () => {
  /**
   * Update a user's profile information
   */
  router.post('/edit', (req, res) => {
    // Check to make sure poster is logged in
    UserCheck(req, (authRes) => {
      // Return any authentication errors
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate variables from the request
        const { name } = req.body;

        // Error checking
        if (!name) {
          res.send({
            success: false,
            error: "Name must be populated.",
          });
        } else if (!name.indexOf(" ")) {
          res.send({
            success: false,
            error: "Name must contain at least 1 space.",
          });
        } else {
          // The name is properly formatted
          // Search for user in Mongo
          User.findById(req.session.passport.user, (err, user) => {
            // Error finding user
            if (err) {
              res.send({
                success: false,
                error: 'Something went wrong. Check the form and try again.',
              });
            } else if (!user) {
              // User doesn't exist in Mongo
              res.send({
                success: false,
                error: 'Cannot find user.'
              });
            } else {
              // Update user with new name
              user.name = name;
              // Save in Mongo
              user.save(userErr => {
                // Error saving user
                if (userErr) {
                  res.send({
                    success: false,
                    error: 'Failed to update account information. Check the form and try again.',
                  });
                } else {
                  // User name updated successfully
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  return router;
};
