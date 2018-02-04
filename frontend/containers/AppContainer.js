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

// Authorization components
import Login from '../components/auth/Login';
import requireCurator from '../components/auth/RequireCurator';
import requireAdmin from '../components/auth/RequireAdmin';
import requireLogin from '../components/auth/RequireLogin';
import Account from '../components/auth/Account';
import EditPassword from '../components/auth/EditPassword';

// Content viewing components
import Home from '../components/Home';
import Article from '../components/content/articles/Article';
import Articles from '../components/content/articles/Articles';
import Listing from '../components/content/listings/Listing';
import Listings from '../components/content/listings/Listings';
import Video from '../components/content/videos/Video';
import Videos from '../components/content/videos/Videos';

// Content creation components
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';

// Content editing components
import EditArticleForm from '../components/content/forms/EditArticleForm';
import EditListingForm from '../components/content/forms/EditListingForm';
import EditVideoForm from '../components/content/forms/EditVideoForm';

// Other components
import About from '../components/About';
import Contact from '../components/Contact';
import Credits from '../components/Credits';
import Terms from '../components/Terms';
import Privacy from '../components/Privacy';
import Admin from '../components/Admin';
import NotFoundSection from '../components/NotFoundSection';
import Profile from '../components/Profile';

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
   */
  componentDidMount() {
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
    .then((resp) => {
      // Redux persist and backend state are NOT synced. Need to wipe redux state and redirect to login
      if (!resp.data.success) {
        console.log('states not synced.');
        // Dispatch the logout action
        onLogout();
        // Set the state to redirect to login
        this.setState({
          redirectToLogin: true,
        });
      } else {
        const user = resp.data.user;
        // If user is logged in through facebook on backend, update on Frontend
        if (resp.data.facebook) {
          // Send redux event
          // onLogout();
          // TODO Remove dummy location
          onLogin(user.userId, user.userType, user.name, "Philadelphia, PA", user.profilePicture);
        }
      }
    })
    .catch((err) => {
      /**
       * TODO Handle error better
       */
      console.log('Error with syncing state', err);
    });
  }

  // Render the application
  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <div className="nav-space" />
            <div className="app-content">
              <Switch>

                { /* User registration routes */ }
                <Route exact path="/login" component={Login}/>

                { /* Other user routes */ }
                <Route exact path="/account" component={requireLogin(Account)} />
                <Route exact path="/password" component={requireLogin(EditPassword)} />

                { /* Routes for viewing profiles */ }
                <Route exact path="/users/:id" component={Profile} />

                { /* General routes */ }
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/terms" component={Terms}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route exact path="/credits" component={Credits}/>
                <Route exact path="/" component={Home}/>

                { /* Admin routes */ }
                <Route exact path="/admin" component={requireAdmin(Admin)}/>

                { /* Routes for articles */ }
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/new" component={requireCurator(ArticleForm)} />
                <Route exact path="/articles/:id" component={Article} />
                <Route exact path="/articles/:id/edit" component={requireCurator(EditArticleForm)} />

                { /* Routes for listings */ }
                <Route exact path="/listings" component={Listings} />
                <Route exact path="/listings/new" component={requireCurator(ListingForm)} />
                <Route exact path="/listings/:id" component={Listing} />
                <Route exact path="/listings/:id/edit" component={requireCurator(EditListingForm)} />

                { /* Routes for videos */ }
                <Route exact path="/videos" component={Videos} />
                <Route exact path="/videos/new" component={requireCurator(VideoForm)} />
                <Route exact path="/videos/:id" component={Video} />
                <Route exact path="/videos/:id/edit" component={requireCurator(EditVideoForm)} />

                { /* 404 if no other route was matched */ }
                <Route exact path="/*" component={NotFoundSection}/>

                {/* Redirect to the login page when the user signs out */}
                { this.state.redirectToLogin && (<Redirect to="/login"/>) }
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
    onLogin: (userId, userType, name, location, profilePicture) => dispatch(login(userId, userType, name, location, profilePicture)),
  };
};

// Redux config
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
