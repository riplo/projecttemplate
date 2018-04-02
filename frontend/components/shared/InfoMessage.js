import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an info message to the user
 * Optionally, an error can be passed in. If there is an error then no success
 * message is displayed
 */
const InfoMessage = ({ message, error }) => {
  // Ensure that the passed in message is a string and not an object
  if (message && typeof message !== "string") {
    console.dir(message);
    return null;
  }

  // If props were passed down
  if (message && !error) {
    return (
      <div className="alert alert-warning">
        <p className="marg-bot-0 normal">
          { message }
        </p>
      </div>
    );
  }

  // Else, render nothing
  return null;
};

// Props validations
InfoMessage.propTypes = {
  message: PropTypes.string,
  error: PropTypes.string,
};

export default InfoMessage;
