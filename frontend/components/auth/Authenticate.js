// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import components
import Login from './Login';


export default function(ComponentToRender) {
    class Authenticate extends Component {
        componentWillMount() {
            if (!this.props.userId) {
                return (<Login/>);
            } else {
                return (<Login/>);
                console.log('userid inside require auth', this.props.userId);
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.userId) {
                return (<Login/>);
            }
        }

        render() {
            console.log('userid inside require auth', this.props.userId);
            return (
                <ComponentToRender {...this.props} />
            );
        }
    }

    Authenticate.propTypes = {
        userId: PropTypes.string,
    };

    const mapStateToProps = (state) => {
        console.log('state', state);
        return {
            userId: state.loginState.userId
        };
    };

    return connect(mapStateToProps)(Authenticate);
}
