// File to handle password verification via email

// Import frameworks
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Import Models
const User = require('../models/user');

// Import helper methods
const {UserCheck} = require('../helperMethods/authChecking');

// Import env variables
const HOST_URL = process.env.HOST_URL;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Route to send a user a verification email
 */
module.exports = () => {
  router.get('/verify', (req, res) => {
    // Verify a user is logged in
    UserCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const userId = req.session.passport.user;
        // Find user in Mongo
        User.findById(userId, (err, user) => {
          if (err) {
            res.send({
              success: false,
              error: err.message,
            });
          } else {
            // Email addresses them by first name
            const displayName = user.first;
            // Set up the html
            const html = (
              `<div style=\"background:#efefef;background-color:#efefef;width:100%;padding:0px,16px,32px,16px;\"` +
              `bgcolor:\"#efefef\"><div style=\"background:#ffffff;background-color:#ffffff;width:100%;padding:16px;` +
              `color:#606060;font-family:Verdana, serif;\" bgcolor=\"#ffffff\">` +
              'Hi ' + displayName + ',\n Please verify your account at the following link:\n\n' +
              HOST_URL + '/verify/' + user.verificationToken + '\n\n'
            );

            // Compose message
            const msg = {
              to: user.username,
              from: process.env.SENDGRID_EMAIL,
              subject: 'Verify your account, ' + displayName,
              text: 'Hi ' + displayName + ',\n Please verify your account at the following link:\n\n' +
              HOST_URL + '/verify/' + user.verificationToken + '\n\n',
              html,
            };

            // Send message
            sgMail.send(msg, (errEmail) => {
              if (errEmail) {
                res.send({
                  success: false,
                  error: errEmail,
                });
              } else {
                // Send back user
                res.send({
                  success: true,
                  error: '',
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to actually verify user
  router.get('/verified/:token', (req, res) => {
    // Check to ensure user is logged in
    UserCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate parameters
        const token = req.params.token;
        const userId = req.session.passport.user;

        // Find user in Mongo
        User.findById(userId, (err, user) => {
          if (err) {
            res.send({
              success: false,
              error: err.message,
            });
          } else {
            // User is verifying from a wrong account
            if (user.verificationToken !== token) {
              res.send({
                success: false,
                error: 'Verification failed.',
              });
            } else {
              // Update user
              user.verificationToken = undefined;
              user.accountVerified = true;
              // Save user changes
              user.save((errSave) => {
                if (errSave) {
                  res.send({
                    success: false,
                    error: errSave,
                  });
                } else {
                  // Verification successful
                  res.send({
                    success: true,
                    error: '',
                  });
                }
              });
            }
          }
        });
      }
    });
  });
  return router;
};
