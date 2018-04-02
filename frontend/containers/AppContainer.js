// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import axios from 'axios';

// Import actions
import { logout } from '../actions/index.js';
import { login } from '../actions/index.js';

// Shared and general components
import Nav from '../components/nav/Nav';
import Footer from '../components/shared/Footer';
import Notification from '../components/shared/Notification';

// Authorization components
import Login from '../components/auth/Login';
import requireCurator from '../components/auth/RequireCurator';
import requireAdmin from '../components/auth/RequireAdmin';
import requireLogin from '../components/auth/RequireLogin';
import Account from '../components/auth/Account';
import EditPassword from '../components/auth/EditPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Verify from '../components/auth/Verify';

// Content viewing components
import Home from '../components/home/Home';

// Other components
import About from '../components/About';
import Contact from '../components/Contact';
import Credits from '../components/Credits';
import Terms from '../components/Terms';
import Privacy from '../components/Privacy';
import NotFoundSection from '../components/NotFoundSection';

/**
 * Component to handle routing on the frontend
 * When necessary, these components will pull data from the backend
 * Backend routes are prefixed with 'api/' and reside in '../backend/routes.js'
 *
 */

class AppContainer extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    // Set the state
    this.state = {
      redirectToLogin: false,
    };
  }

  /**
    * This method ensures that the state stored in redux persist does not outlast the backend setState.
    * If the backend and frontend states aren't synced, redirects to login and wipes redux state.
    * If the user attempted to login with facebook/google, will dispatch login action
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    // Isolate variables
    const onLogout = this.props.onLogout;
    const onLogin = this.props.onLogin;
    const userId = this.props.userId;

    // Call to backend (routes.js)
    axios.get('/api/sync', {
      params: {
        userId,
      }
    })
    .then(resp => {
      // Redux persist and backend state are NOT synced. Need to wipe redux state and redirect to login
      if (!resp.data.success) {
        // Dispatch the logout action
        onLogout();
        // Set the state to redirect to login
        this.setState({
          redirectToLogin: true,
        });
      } else {
        // Get the user from the response
        const user = resp.data.user;
        // If user is logged in through facebook on backend, update on Frontend
        if (resp.data.oAuthLogin) {
          // Send redux event
          onLogin(user.userId, user.userType, user.name);
        }
      }
    })
    .catch(() => {});
  }

  // Render the application
  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <Notification />
            <div className="nav-space" />
            <div className="app-content">
              <Switch>

                { /* User registration routes */ }
                <Route exact path="/login" component={Login}/>

                { /* Other user routes */ }
                <Route exact path="/account" component={requireLogin(Account)} />
                <Route exact path="/password" component={requireLogin(EditPassword)} />
                <Route exact path="/reset/:token" component={ResetPassword} />
                <Route exact path="/verify/:token" component={requireLogin(Verify)} />

                { /* General routes */ }
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/terms" component={Terms}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route exact path="/credits" component={Credits}/>
                <Route exact path="/" component={Home}/>


                { /* 404 if no other route was matched */ }
                <Route exact path="/*" component={NotFoundSection}/>

                {/* Redirect to the login page when the user signs out */}
                { (this.state.redirectToLogin && window.location.pathname !== "/login") && (<Redirect to="/login"/>) }
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

AppContainer.propTypes = {
  userId: PropTypes.string,
  onLogout: PropTypes.func,
  onLogin: PropTypes.func,
  match: PropTypes.object,
};

// Necessary so we can access this.props.userId
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
  };
};

// Necessary so we can access this.props.onLogout()
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
    onLogin: (userId, userType, name) => dispatch(login(userId, userType, name)),
  };
};

// Redux config
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
