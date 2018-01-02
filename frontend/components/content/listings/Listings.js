// Import frameworks
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';

/**
 * Component for the homepage of the application
 */
class Listings extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      listings: [],
      pending: true,
      error: "",
    };
  }

  /**
   * Load listings from Mongo once the component mounts
   */
  componentDidMount() {
    axios.get('/api/listings')
      .then((resp) => {
        if (resp.data.success) {
          this.setState({
            listings: resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * Method renders each individual listing
   */
  renderListings() {
    return this.state.listings.map((listing) => (
      <div className="col-6 col-lg-4 col-xl-3" key={ listing._id } >
        <Link to={ `/listings/${listing._id}` } >
          <div className="article-preview">
            <img className="img-fluid" alt={listing.name} src={listing.image} />
            <h2 className="title">
              {listing.name}
            </h2>
            <h6 className="subtitle">
              {listing.description}
            </h6>
          </div>
        </Link>
      </div>
    ));
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        <h3 className="title">
          Listings
        </h3>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.state.error ? (
                <ErrorMessage error={ this.state.error } />
              ) : (
                this.renderListings()
              )
            )
          }
          {
            !this.state.pending && (
              <div className="col-12 marg-top-1">
                <Button />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Listings;
