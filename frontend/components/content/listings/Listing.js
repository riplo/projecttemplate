// Import frameworks
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid-v4';

// Import components
import Review from './Review';
import ReviewForm from './ReviewForm';
import Loading from '../../shared/Loading';
import Button from '../../shared/Button';
import NotFoundSection from '../../NotFoundSection';
import { Link } from 'react-router-dom';

/**
 * Component to render a listing
 */
class Listing extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      listingId: '',
      img: "",
      title: "",
      description: "",
      website: "",
      price: "",
      amenities: {},
      location: "",
      reviews: [],
      error: "",
      pending: true,
      infoTrigger: false,
    };

    // Bind this to helper methods
    this.renderAmenities = this.renderAmenities.bind(this);
    this.renderReviewsSection = this.renderReviewsSection.bind(this);
    this.renderReview = this.renderReviews.bind(this);
    this.handleClickInfoTrigger = this.handleClickInfoTrigger.bind(this);
    this.updateReviews = this.updateReviews.bind(this);
  }

  // Pull the listing data from the database
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            listingId: id,
            error: "",
            ...res.data.data,
            time: moment(res.data.timestamp).fromNow(),
            pending: false,
          });
        } else {
          // If there was an error with the request
          this.setState({
            listingId: id,
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method which will be called by child component (ReviewForm) to update state
  updateReviews() {
    // Find the listing
    axios.get(`/api/listings/${this.state.listingId}`)
      .then(res => {
        if (res.data.success) {
          // Update state with new review
          this.setState({
            error: "",
            ...res.data.data,
            time: moment(res.data.timestamp).fromNow(),
            pending: false,
          });
        } else {
          // If there was an error with the request
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method to render amenities
  renderAmenities() {
    // If amenities are in the state (this should always be the case)
    if (this.state.amenities && Object.keys(this.state.amenities).length) {
      // Get all keys from the amenities object
      const keys = Object.keys(this.state.amenities);

      // Map from amenities to properly formatted text
      const map = {
        foodTrucks: "Food truck",
        lateNights: "Late nights",
        healthy: "Healthy",
        forTheSweetTooth: "For the sweet tooth",
        forTheStudyGrind: "For the study grind",
        openLate: "It's midnight and I'm hungry",
        parentsVisiting: "Parents visiting!!??",
        gotPlasteredLastNight: "Got plastered last night",
        bars: "Bars",
        byos: "BYO",
        speakeasies: "Speakeasies",
        dateNight: "Date night",
        formals: "Formals",
        birthdays: "Birthdays",
        treatYourself: "Treat yourself",
        adulting: "#adulting",
        feelingLazy: "Feeling lazy",
        holeInTheWall: "Hole in the wall",
        showoffToYourFriends: "Show off to your friends",
        forTheGram: "#forTheGram",
      };

      // Return an amenity div tag for each amenity which is true in the state
      // That is, if the curator marked that the listing has said amenity
      return keys.map(amenity => (
        this.state.amenities[amenity] ? (
          <div className="amenity" key={ amenity }>
            { map[amenity] }
          </div>
        ) : null
      ));
    }

    // If there are no amentities return nothing
    return (
      <div className="card pad-1 marg-bot-1">
        No amenities have been marked for this listing.
      </div>
    );
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to render the entire reviews section
  renderReviewsSection() {
    // Count the number of reviews
    const count = this.state.reviews.length;

    // Compute the average rating for all reviews
    let average = 0.0;
    this.state.reviews.forEach(review => {
      average += review.rating;
    });
    if (count !== 0) {
      average = average / count;
    }

    // Isolate listingId to pass to ReviewForm
    const listingId = this.props.match.params.id;

    // Return the section
    return (
      <div>
        <h5 className="subtitle">
          Reviews
        </h5>
        { /* Give some details about the reviews left on this listing */ }
        <p>
          There { count === 1 ? ("is 1 review") : (`are ${count} reviews`) } on this listing
          {
            (count === 0) ? (".") : (` with an average rating of ${ average.toFixed(1) } out of 5.0 stars.`)
          }
        </p>
        <ReviewForm listingId={listingId} updateReviews={this.updateReviews}/>
        { this.renderReviews() }
      </div>
    );
  }

  // Helper method to render reviews
  renderReviews() {
    // Check if there are reviews to return
    if (this.state.reviews) {
      // Reverse reviews so they appear newest to oldest
      const reviews = this.state.reviews.slice(0).reverse();
      // Map each review to be its own component
      return reviews.map(review => (
        <Review
          title={ review.title }
          content={ review.content }
          key={ uuid() }
          createdAt={ review.createdAt }
          rating={ review.rating }
          name={ review.name }
        />
      ));
    }

    // If there are no reviews
    // TODO: Why isn't this showing up?
    return (
      <div className="card marg-bot-1">
        No one has reviewed this listing yet! You could be the first.
      </div>
    );
  }

  // Helper method to convert from military to normal time
  formatHours(hour) {
    return moment(hour, 'HH:mm').format('h:mm a');
  }

  // Helper method to render Hours
  renderHours() {
    if (this.state.hours) {
      // Isolate variable
      const hours = this.state.hours;
      return (
        // If a date has a start and end time, it will be displayed
        <div>
          {hours.monday.start && hours.monday.finish && <div>Monday: {this.formatHours(hours.monday.start)} - {this.formatHours(hours.monday.finish)}</div>}
          {hours.tuesday.start && hours.tuesday.finish && <div>Tuesday: {this.formatHours(hours.tuesday.start)} - {this.formatHours(hours.tuesday.finish)}</div>}
          {hours.wednesday.start && hours.wednesday.finish && <div>Wednesday: {this.formatHours(hours.wednesday.start)} - {this.formatHours(hours.wednesday.finish)}</div>}
          {hours.thursday.start && hours.thursday.finish && <div>Thursday: {this.formatHours(hours.thursday.start)} - {this.formatHours(hours.thursday.finish)}</div>}
          {hours.friday.start && hours.friday.finish && <div>Friday: {this.formatHours(hours.friday.start)} - {this.formatHours(hours.friday.finish)}</div>}
          {hours.saturday.start && hours.saturday.finish && <div>Saturday: {this.formatHours(hours.saturday.start)} - {this.formatHours(hours.saturday.finish)}</div>}
          {hours.sunday.start && hours.sunday.finish && <div>Sunday: {this.formatHours(hours.sunday.start)} - {this.formatHours(hours.sunday.finish)}</div>}
        </div>
      );
    }
    // If there are no hours
    return (
      <div>
        Unfortunately, hours are not published for this listing.
      </div>
    );
  }

  // Render the component
  render() {
    // Return the component
    return (
      this.state.pending ? (
        <Loading />
      ) : (
        this.state.error ? (
          <NotFoundSection
            title="Listing not found"
            content="Uh-oh! Looks like the listing you were looking for was either removed or does not exist."
            url="/listings"
            urlText="Back to all listings"
          />
        ) : (
          <div className="listing">
            <div
              className="background-image preview background-fixed"
              style={{ backgroundImage: `url(${this.state.image})` }}
            />
            <div className="container content">
              <div className="row">
                {/* Contains details about the listing */}
                <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-0">
                  <div className="header">
                    <h1 className="title">
                      { this.state.title }
                    </h1>
                  </div>
                  <p className="description">
                    { this.state.description }
                  </p>
                  <div className="line" />
                  <h5 className="subtitle">
                    Amenities
                  </h5>
                  { this.renderAmenities() }
                  <div className="line" />
                  <h5 className="subtitle">
                    Location
                  </h5>
                  <p className="description">
                  {this.state.location}
                  </p>
                  <div className="line" />
                  { this.renderReviewsSection() }
                </div>

                {/* Contains overview aboute the listing */}
                <div
                  id="listing-preview"
                  className={
                    this.state.infoTrigger ? (
                      "col-12 col-lg-4 listing-preview active"
                    ) : (
                      "col-12 col-lg-4 listing-preview"
                    )
                  }
                  style={{
                    bottom: this.state.infoTrigger ? (- document.getElementById('listing-preview').offsetHeight + 64) : 0
                  }}
                >
                  <div className="card">
                    <i
                      className={
                        this.state.infoTrigger ? (
                          "fa fa-chevron-down hidden-lg-up fa-lg info-trigger active"
                        ) : (
                          "fa fa-chevron-down hidden-lg-up fa-lg info-trigger"
                        )
                      }
                      aria-hidden="true"
                      onClick={ this.handleClickInfoTrigger }
                    />
                    <h2>
                      { this.state.title }
                    </h2>
                    {
                      this.state.website && (
                        <Link to={ this.state.website }>
                          <i className="fa fa-globe" aria-hidden="true" />
                          &nbsp;
                          {
                            this.state.website.length > 18 ? (
                              this.state.website.substring(0, 18) + "..."
                            ) : (
                              this.state.website
                            )
                          }
                        </Link>
                      )
                    }
                    {
                      this.state.price && (
                        <p className="price">
                          <strong>
                            Price:&nbsp;
                          </strong>
                          { this.state.price }
                        </p>
                      )
                    }
                    {
                      // TODO: Style rating better, perhaps stars
                      this.state.rating && (
                        <p className="price">
                          <strong>
                            Rating:&nbsp;
                          </strong>
                          { this.state.rating }/5
                        </p>
                      )
                    }
                    {
                      // TODO: Style hours better, perhaps in its own section
                      this.state.hours && (
                        <p className="price">
                          <strong>
                            Hours:&nbsp;
                          </strong>
                          {this.renderHours()}
                        </p>
                      )
                    }
                    <p className="description">
                      { this.state.description }
                    </p>
                  </div>
                </div>
                <div className="space-1" />
                <Button />
              </div>
            </div>
            <div className="space-2" />
          </div>
        )
      )
    );
  }
}

Listing.propTypes = {
  match: PropTypes.object,
};

export default Listing;
