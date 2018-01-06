import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import Search from './Search';

/**
 * Renders the navbar at the top of the screen on all pages.
 * TODO search functionality
 * TODO populate this with user name CONDITIONALLY (if user isnt logged in, nothing)
 * TODO pull location from the database
 */
class Nav extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
      active: false,
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }

  /**
   * Handle when a user searches for something
   */
  handleChangeSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  /**
   * Render the navbar
   */
  render() {
    return (
      <nav className="nav">
        {/* Render the logo which links to the home page */}
        <Link to="/" className="logo">
          <img src="https://s3.amazonaws.com/nalda/nalda_logo.svg" alt="Nalda" />
        </Link>

        { /* Render the search bar on the left of the navbar */ }
        <Search />

        { /* Render the user's profile information if the user is logged in */ }
        { /* If the user is not logged in, an empty div is returned */ }
        { /* NOTE the empty div preserves styling of the sidebar */ }
        {
          this.props.userId ? (
            <div className="user-info">
              <div className="user-text">
                { /* Render the user's location information */ }
                <div className="location">
                  {
                    this.props.location.indexOf(",") > 0 ? (
                      this.props.location.substring(0, this.props.location.lastIndexOf(","))
                    ) : (
                      this.props.location
                    )
                  }
                </div>
                <div className="name">
                  <p>
                    Hi, <Link to="/account">{this.props.name}</Link>
                  </p>
                </div>
              </div>
              <div className="user-img" />
            </div>
          ) : (
            <div className="user-info">
              <div className="sign-in-links">
                <Link to="/login" className="login">
                  Login
                </Link>
                <Link to="/register" className="register">
                  Register
                </Link>
              </div>
            </div>
          )
        }

        { /* Render the sidebar */ }
        { /* This includes the three-bar meny toggle which is always visible */ }
        <Sidebar />
      </nav>
    );
  }
}

Nav.propTypes = {
  userId: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    name: state.authState.name,
    location: state.authState.location,
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Nav = connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);

export default Nav;
