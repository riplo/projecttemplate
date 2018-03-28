// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';

// Import actions
import {notifyMessage} from '../../actions/notification';

/**
 * Component for Admin only, allows them to add and remove other admins and content curators
 */
class Admin extends Component {

  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Resize textarea to fit input
    autosize(document.querySelectorAll('textarea'));

    // Pull data to display on admin panel
    axios.get('/api/admin')
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          error: '',
          pending: false,
        });
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
        pending: false,
      });
    });
  }

  // Render the component
  render() {
    // If the app is pending
    if (this.state.pending) return (<Loading />);
    return (
      <div className="container-fluid">
        <div className="row">
            <div className="col-12 col-md-8 col-lg-8 col-xl-7">
              <div className="space-1" />
              <ErrorMessage error={ this.state.error } />
              <div>
                <h4>Admin panel</h4>
                Welcome to the admin panel; through this portion of the application you can keep track of your user base, recommended content, and created content.
              </div>
              <div className="space-2" />
            </div>
        </div>
      </div>
    );
  }
}

// Prop validations
Admin.propTypes = {
  notifyMessage: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux
const mapDispatchToProps = dispatch => {
  return {
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
export default Admin;
