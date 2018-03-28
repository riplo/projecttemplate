/**
 * Handles all backend routes for admin related privileges
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Export the following methods for routing
module.exports = () => {
  /**
   * Route to pull data to admin panel
   */
  router.get('/admin', (req, res) => {
  });

  return router;
};
