// Import framworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import Dropzone from 'react-dropzone';

// Import actions
import {changeFullName} from '../../actions/index.js';
import {changeProfilePicture} from '../../actions/index.js';
import {changeUserLocation} from '../../actions/index.js';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Button from '../shared/Button';
import Loading from '../shared/Loading';
import Tags from '../shared/Tags';

/**
 * Component to render a user's account information
  */
class Account extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      prevName: '',
      email: '',
      type: '',
      bio: '',
      profilePicture: {},
      profilePictureChanged: false,
      accountVerified: false,
      error: '',
      success: '',
      info: '',
      pending: true,
    };

    // Bind this to helper methods
    this.handleAdminClick = this.handleAdminClick.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleBioClick = this.handleBioClick.bind(this);
    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.handleProfilePictureClick = this.handleProfilePictureClick.bind(this);
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Pull the user's account data
    axios.get('/api/account', {
      params: {
        userId: this.props.userId,
      }
    })
    .then(resp => {
      // If successful, will set state with user's information
      if (resp.data.success) {
        this.setState({
          name: resp.data.data.name,
          email: resp.data.data.username,
          type: resp.data.data.userType,
          bio: resp.data.data.bio || '',
          profilePicture: resp.data.data.profilePicture,
          accountVerified: resp.data.data.accountVerified,
          error: "",
          pending: false
        });
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
        });
      }
    }).catch((err) => {
      this.setState({
        pending: false,
        error: err,
      });
    });
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    if (this.state.editName) {
      // Focus on the name input upon clicking edit
      this.nameInput.focus();
    } else if (this.state.editBio) {
      // Focus on the bio text area upon clicking edit
      this.bioInput.focus();
    } else if (this.state.editLocation) {
      // Focus on the location text area upon clicking edit
      this.locationInput.focus();
    }

    // Isolate location
    const location = document.getElementById('location');
    if (location) {
      // Autocomplete the user's city
      const options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'},
      };
      new google.maps.places.Autocomplete(location, options);
    }

    // Autosize textareas
    autosize(document.querySelectorAll('textarea'));
  }


  /**
   * Handle a user wanting to verify their email
   */
  handleVerifyEmail() {
    axios.get('/api/verify')
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          info: 'Please check your email for a verification link.',
        });
      } else {
        // Display error
        this.setState({
          error: resp.data.error,
        });
      }
    })
    // Display error
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }
  /**
   * Handle a change to the name state
   */
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  /**
   * Helper method to trigger edit name
   */
  handleNameClick() {
    // Isolate function
    const changeName = this.props.changeName;

    if (this.state.editName) {
      if (!this.state.name) {
        this.setState({
          error: 'Name cannot be empty.',
          name: this.state.prevName,
        });
      } else {
        // Save the updated name
        axios.post('/api/users/name', {
          userId: this.props.userId,
          name: this.state.name,
        })
       .then((resp) => {
         // If there was an error, display it
         if (!resp.data.success) {
           this.setState({
             error: resp.data.error,
           });
         } else {
           this.setState({
             error: '',
           });
           // change redux state
           changeName(this.state.name);
         }
       });
      }
    }
    // Update the state
    this.setState({
      editName: !this.state.editName,
      prevName: this.state.name,
    });
  }
  /**
   * Handle click to edit profile picture
   */
  handleProfilePictureClick() {
    if (this.state.editProfilePicture) {
      // Isolate variables
      const changeProfilePic = this.props.changeProfilePic;
      const userId = this.props.userId;
      const profilePicture = this.state.profilePicture;
      const profilePictureChanged = this.state.profilePictureChanged;

      // Error checking
      if (!profilePicture) {
        this.setState({
          error: 'Profile picture cannot be empty',
        });
      } else if (profilePictureChanged) {
        // Post to backend to change profile picture
        axios.post('/api/users/profilePicture', {
          userId,
          profilePicture,
        })
        .then((resp) => {
          if (!resp.data.success) {
            this.setState({
              error: resp.data.error,
            });
          } else {
            // Dispatch redux action to change profile picture
            this.setState({
              error: '',
              profilePictureChanged: false,
            });
            changeProfilePic(profilePicture);
          }
        })
        .catch((err) => {
          this.setState({
            error: err,
          });
        });
      }
    }
    // Update the state
    this.setState({
      editProfilePicture: !this.state.editProfilePicture,
    });
  }

  // Helper method that is fired when a profile picture is added
  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles && acceptedFiles.length) {
      // Read only the first file passed in
      const profilePicture = acceptedFiles[0];

      const reader = new FileReader();
      // Convert from blob to a proper file object that can be passed to server
      reader.onload = (upload) => {
        this.setState({
          profilePicture: upload.target.result,
          error: '',
          profilePictureName: profilePicture.name,
          profilePictureChanged: true,
        });
      };
      // File reader set up
      reader.onabort = () => this.setState({error: "File read aborted."});
      reader.onerror = () => this.setState({error: "File read error."});
      reader.readAsDataURL(profilePicture);
    } else {
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
  }

  /**
   * Handle a change to the bio state
   */
  handleChangeBio(event) {
    this.setState({
      bio: event.target.value,
    });
  }

  /**
   * Helper method to trigger edit bio
   */
  handleBioClick() {
    if (this.state.editBio) {
      // Save the updated bio
      axios.post('/api/users/bio', {
        userId: this.props.userId,
        bio: this.state.bio,
      })
      .then((resp) => {
        // If there was an error, display it
        if (!resp.data.success) {
          this.setState({
            error: resp.data.error,
          });
        }
      });
    }
    // Update the state
    this.setState({
      editBio: !this.state.editBio,
    });
  }

  /**
   * Helper method to trigger edit bio
   */
  handleLocationClick() {
    // Isolate function
    const changeLocation = this.props.changeLocation;

    if (this.state.editLocation) {
      // Check for empty location
      if (Object.keys(location).length === 0) {
        this.setState({
          error: "Location must be populated.",
          pending: false,
        });
      } else {
        const location = document.getElementById('location').value;
        // Find the longitude and latitude of the location passed in
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': location }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const latitude = results[0].geometry.location.lat();
            const longitude = results[0].geometry.location.lng();
            // Save the updated location
            axios.post('/api/users/location', {
              location: {
                name: location,
                lat: latitude,
                lng: longitude,
              },
            })
            .then((resp) => {
              // If there was an error, display it
              if (!resp.data.success) {
                this.setState({
                  error: resp.data.error,
                });
              } else {
                // Update the state
                this.setState({
                  location,
                });
                changeLocation(location);
              }
            })
            .catch((err) => {
              this.setState({
                success: false,
                error: err,
              });
            });
          } else {
            this.setState({
              error: "",
              pending: false,
            });
          }
        });
      }
    }

    // Update the state
    this.setState({
      editLocation: !this.state.editLocation,
    });
  }

  /**
   * Helper method to trigger popup
   */
  handleAdminClick() {
    this.setState({
      adminPopover: !this.state.adminPopover,
    });
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return (
      <form className="account">
        <label className="bold">
          Name
        </label>
        <input
          className="form-control border marg-bot-1"
          id="name"
          ref={(input) => { this.nameInput = input; }}
          value={ this.state.name }
          onChange={ this.handleChangeName }
        />

        <div>
          <label className="bold">
             Profile Picture
          </label>
          <div
            className="profile-picture background-image"
            style={{
              backgroundImage: `url(${this.props.profilePicture})`
            }}
          />

          <Dropzone
            onDrop={this.onDrop}
            accept="image/*"
            style={{ display: !this.state.editProfilePicture && "none" }}>
            <p className="dropzone">
              <i className="fa fa-file-o" aria-hidden="true" />
              {
                this.state.profilePictureName ? (
                  this.state.profilePictureName
                ) : (
                  "Try dropping some files here, or click to select files to upload."
                )
              }
            </p>
          </Dropzone>
          <i
            className="fa fa-pencil"
            aria-hidden="true"
            onClick={ this.handleProfilePictureClick }
          />
        </div>

        <label className="bold">
          Email
        </label>
        <br />
        <p className="marg-bot-1">
          { this.state.email }
        </p>

        <label className="bold">
          Type
        </label>
        <p className="marg-bot-05">
          { this.state.type }
        </p>
        <div className="gray marg-bot-1">
          A user can either be an admin, curator, or general user. Only Nalda administrators can change your account type.
        </div>

        <label className="bold">
          Bio
        </label>
        <textarea
          className="form-control border marg-bot-1"
          id="bio"
          ref={(input) => { this.bioInput = input; }}
          value={ this.state.bio }
          onChange={ this.handleChangeBio }
        />

        {/* TODO load the location */}
        <label>
          Location
        </label>
        <input
          className="form-control border marg-bot-1"
          id="location"
          type="text"
          ref={(input) => { this.locationInput = input; }}
        />

        <label>
          Password
        </label>
        <br />
        <p className="marg-bot-05">
          ●●●●●●●
        </p>
        <Link to="/password">
          Change your password <i className="fa fa-pencil" aria-hidden="true" />
        </Link>
        <div className="space-2" />

        <div className="save-changes">
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
          <submit className="btn btn-primary disabled">
            Save changes
          </submit>
        </div>
      </form>
    );
  }

  /**
   * Render the component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div>
        <Tags title="Account" description="Edit and view your account information." keywords="edit,account,nalda,information,profile,email,security" />
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <h4 className="bold marg-top-2 marg-bot-1">
                Account information
              </h4>
              <ErrorMessage error={ this.state.error } />
              {
                (!this.state.pending && !this.state.accountVerified) ? (
                  <div className="alert alert-warning marg-bot-1">
                    {this.state.info ? this.state.info : (
                      <span>
                        Please verify your account by clicking <span className="cursor underline" onClick={this.handleVerifyEmail}>here.</span>
                      </span>
                    )}
                  </div>
                ) : null
              }
              {
                this.state.success ? (
                  <div className="alert alert-success marg-bot-1">
                    { this.state.success }
                  </div>
                ) : null
              }
              { this.state.pending ? <Loading /> : this.renderInfo() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  userId: PropTypes.string,
  changeName: PropTypes.func,
  changeProfilePic: PropTypes.func,
  profilePicture: PropTypes.string,
  location: PropTypes.string,
  changeLocation: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
    profilePicture: state.authState.profilePicture,
    location: state.authState.location,
  };
};

// Allows us to dispatch a changeName event by calling this.props.changeFullName
// NOTE this is necessary for redux state to render on nav bar
const mapDispatchToProps = (dispatch) => {
  return {
    changeName: (name) => dispatch(changeFullName(name)),
    changeProfilePic: (profilePicture) => dispatch(changeProfilePicture(profilePicture)),
    changeLocation: (location) => dispatch(changeUserLocation(location))
  };
};

// Redux config
Account = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);

export default Account;
