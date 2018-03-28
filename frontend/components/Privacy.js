// Import frameworks
import React from 'react';

// Import components
import Tags from './shared/Tags';

/**
 * Component to render Riplo's privacy policy
 */
const Privacy = () => {
  // Update the title
  window.scrollTo(0, 0);

  // Return the privacy policy
  return (
    <div className="container">
      <Tags title="Privacy" description="Riplo's privacy policy." keywords="riplo,privacy,policy" />
      <h4 className="dark-gray-text title marg-top-1 marg-bot-1">
        Privacy policy
      </h4>
      <p>
        Riplo reserves all rights to its application and user data.
      </p>
    </div>
  );
};

// Export the component
export default Privacy;
