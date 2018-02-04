// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Stars from './Stars';

/**
 * Component to render a listing
 */
const Review = ({title, content, reviewId, createdAt, rating, name, profilePicture, canChange, deleteReview }) => {
  // Format the timestamp
  const timestamp = moment(new Date(createdAt)).fromNow();
  // Render the component
  return (
    <div className="review-wrapper">
      <div
        className="profile-picture background-image"
        style={{ backgroundImage: `url(${profilePicture})` }}
      />
      <div className="review">
        <p className="timestamp">
          { timestamp }
        </p>
        <p className="name">
          { name }
        </p>
        <div className="title-and-rating">
          <Stars rating={ rating } />
          <h6>
            { title }
          </h6>
        </div>
        <p>
          { content }
        </p>
        {canChange ? <div onClick={() => deleteReview(reviewId)}>DELETE REVIEW!!!!!</div> : null}
      </div>
    </div>
  );
};

Review.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.number,
  rating: PropTypes.number,
  profilePicture: PropTypes.string,
  name: PropTypes.string,
  canChange: PropTypes.bool,
  deleteReview: PropTypes.func,
  reviewId: PropTypes.string,
};

export default Review;
