// Import framworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import autosize from 'autosize';

// Import actions
import {changeFullName} from '../../actions/index.js';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import SuccessMessage from '../shared/SuccessMessage';
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

    // Set the initial state
    this.state = {
      first: '',
      last: '',
      prevName: '',
      email: '',
      type: '',
      accountVerified: false,
      error: '',
      success: '',
      info: '',
      loading: true,
      pending: false,
      hasChanged: false,
    };

    // Bind this to helper methods
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Pull the user's account data
    axios.get('/api/account')
    .then(resp => {
      // If successful, will set state with user's information
      if (resp.data.success) {
        // Update the state
        this.setState({
          first: resp.data.data.first,
          last: resp.data.data.last,
          email: resp.data.data.username,
          type: resp.data.data.userType,
          accountVerified: resp.data.data.accountVerified,
          error: "",
          pending: false,
          loading: false,
        });
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
          loading: false,
        });
      }
    })
    .catch(err => {
      this.setState({
        pending: false,
        loading: false,
        error: err,
      });
    });
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    // Autosize textareas (for example, the bio textarea)
    autosize(document.querySelectorAll('textarea'));
  }

  /**
   * Handle a user wanting to verify their email
   */
  handleVerifyEmail() {
    // Verify a user's email by sending them a verification link
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
  handleChangeFirstName(event) {
    this.setState({
      first: event.target.value,
      hasChanged: true,
    });
  }

  handleChangeLastName(event) {
    this.setState({
      last: event.target.value,
      hasChanged: true,
    });
  }
  /**
   * Handle a change to the bio state
   */
  handleChangeBio(event) {
    this.setState({
      bio: event.target.value,
      hasChanged: true,
    });
  }

  /**
   * Handle saving a user's profile information
   */
  handleSaveChanges(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Denote that the application is pending
    this.setState({ pending: true, hasChanged: false });

    // Frontend error checking
    let error = "";
    if (!this.state.name) {
      error = "You must enter a name.";
    }
    if (error) {
      this.setState({ error, pending: false, });
    } else {
      // Send the request to update the user
      axios.post("/api/users/edit", {
        name: this.state.name,
      })
        .then(res => {
          if (!res.data.success) {
            this.setState({
              pending: false,
              error: res.data.error,
            });
          } else {
            this.props.changeName(this.state.name);
            this.setState({
              pending: false,
              success: "Successfully updated account information.",
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
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return (
      <form className="account" onSubmit={this.handleSaveChanges}>
        <label className="bold">
          First Name
        </label>
        <input
          className="form-control border marg-bot-1"
          id="name"
          ref={(input) => { this.nameInput = input; }}
          value={ this.state.name }
          placeholder="Enter your name here"
          onChange={ this.handleChangeFirstName }
        />

        <label className="bold">
          Last Name
        </label>
        <input
          className="form-control border marg-bot-1"
          id="name"
          ref={(input) => { this.nameInput = input; }}
          value={ this.state.name }
          placeholder="Enter your name here"
          onChange={ this.handleChangeLastName }
        />

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
        <div className="tags">
          <span className="tag marg-bot-05">
            { this.state.type }
          </span>
        </div>
        <div className="gray marg-bot-1">
          A user can either be a general user or an admin. Only Riplo administrators can change your account type.
        </div>

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
          <button className={(this.state.hasChanged && this.state.name) ? "btn btn-primary" : "btn btn-primary disabled"} type="submit" value="submit">
            { this.state.pending ? "Saving changes..." : "Save changes" }
          </button>
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
        <Tags title="Account" description="Edit and view your account information." keywords="edit,account,riplo,information,profile,email,security" />

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <h4 className="bold marg-top-2 marg-bot-1 dark-gray-text">
                Account information
              </h4>
              <ErrorMessage error={ this.state.error } />
              <SuccessMessage message={ this.state.success } error={ this.state.error } />
              {
                (!this.state.loading && !this.state.accountVerified) ? (
                  <div className="alert alert-warning marg-bot-1">
                    {this.state.info ? this.state.info : (
                      <span>
                        Please verify your account by clicking <span className="cursor underline" onClick={this.handleVerifyEmail}>here.</span>
                      </span>
                    )}
                  </div>
                ) : null
              }
              { this.state.loading ? <Loading /> : this.renderInfo() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Prop validations
Account.propTypes = {
  userId: PropTypes.string,
  changeName: PropTypes.func,
};

// Allows us to access redux state inside component
const mapStateToProps = ({}) => {
  return {
  };
};

// Allows us to dispatch a changeName event by calling this.props.changeFullName
// NOTE this is necessary for redux state to render on nav bar
const mapDispatchToProps = (dispatch) => {
  return {
    changeName: (name) => dispatch(changeFullName(name)),
  };
};

// Redux config
Account = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);

export default Account;
