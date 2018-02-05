// Import frameworks
const express = require('express');
const router = express.Router();
const bCrypt = require('bcrypt-nodejs');

// Import Models
const User = require('../models/user');

/**
 * Reset a user's password
 */
 // TODO security
 // TODO call from componentDidMount of ResetPassword.js
module.exports = () => {
  router.get('/reset/:token', (req, res) => {
    // Isolate parameters
    const token = req.params.token;
    // Find given user with refresh token in Mongo, makes sure it isn't expired
    User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}, (err, user) => {
      if (err) {
        res.send({
          success: false,
          error: err.message,
        });
        // Token is not valid
      } else if (!user) {
        res.send({
          success: false,
          error: 'Password reset token is invalid or has expired.'
        });
      } else {
        // No errors
        res.send({
          success: true,
          error: '',
        });
      }
    });
  });

  // Route to handle resetting a password
  // TODO security
  router.post('/reset/:token', (req, res) => {
    // Isolate variables
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;
    const token = req.params.token;
    console.log('what is token', token);

    // Error checking
    // TODO make sure new password meets validity conditions
    // TODO cannot be same as old password
    if (!newPassword) {
      res.send({
        success: false,
        error: 'Password cannot be empty.',
      });
    } else if (newPassword !== newPasswordConfirm) {
      res.send({
        success: false,
        error: 'Passwords must match.',
      });
    } else if (invalidPassword(newPassword)) {
      // Make sure it meets validity conditions
      res.send({
        success: false,
        error: invalidPassword(newPassword),
      });
    } else {
      // Find given user with refresh token in Mongo, makes sure it isn't expired
      User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}, (err, user) => {
        if (err) {
          console.log('errrr', err);
          res.send({
            success: false,
            error: err.message,
          });
          // Token is not valid
        } else if (!user) {
          console.log('no user');
          console.log(user);
          res.send({
            success: false,
            error: 'Password reset token is invalid or has expired.'
          });
        } else {
          console.log('user is chillin');
          // Ensure it isn't same as old password
          // if (isCorrect(user, newPassword)) {
          //   console.log('already had that username');
          //   res.send({
          //     success: false,
          //     error: 'New password must be unique from last password.',
          //   });
          // } else {
            // New password is unique
            // Update password
            console.log('tryna save');
            user.password = createHash(newPassword);
            user.save((errUser) => {
              // Error saving changes
              if (errUser) {
                console.log('errSaveing');
                res.send({
                  succcess: false,
                  error: errUser,
                });
              } else {
                // Successful password change
                console.log('done');
                res.send({
                  success: true,
                  error: '',
                });
              }
            });
          }
        // }
      });
    }
  });

  return router;
};

/**
 * Checks password to make sure it is valid
 * Must contain between 8-30 characters, have a number, uppercase,
 * special character, no weird characters
 */
const invalidPassword = (password) => {
  // Error checking
  if (password.length < 8) {
    return 'Password must be at least length 8.';
  } else if (password.length > 30) {
	  return 'Password is too long.';
  } else if (password.search(/\d/) === -1) {
    return 'Password must contain a number';
  } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) !== -1) {
	  return 'Password contains invalid character';
  } else if (!/[A-Z]/.test(password)) {
	  return 'Password must contain a capital letter';
  }

  // If there was no error
  return false;
};

/**
 * Generates hash using bCrypt, storing password safely
 */
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

// Method to check encrypted password
const isCorrect = (user, password) => {
  console.log('err here');
  return bCrypt.compareSync(password, user.password);
};
