// Import framworks
import React, { Component } from 'react';

// Import components
import Thin from './shared/Thin';
import Tags from './shared/Tags';

class About extends Component {
  /**
   * When the component mounts
   */
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /**
   * Renders about component
   */
  render() {
    return (
      <Thin>
        <div>
          <Tags title="About" description="Learn more about Riplo." />
          <h3 className="primary-text marg-top-1 marg-bot-1">
            Hey there, we're Riplo
          </h3>
          <p className="dark-gray-text">
            hello world
          </p>
          <p className="dark-gray-text">
            hello world
          </p>
          <p className="dark-gray-text">
            hello world
          </p>
          <p className="dark-gray-text">
            hello world
          </p>
          <p className="dark-gray-text italic marg-bot-2">
            - The Riplo team
          </p>
        </div>
      </Thin>
    );
  }
}

export default About;
