import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the navbar at the top of the screen on all pages.
 *
 * TODO make this stateful depending on if the user is logged in or not.
 * Currently, it assumes that the user is not logged in.
 */
const Nav = () => {
  return (
    <nav className="navbar navbar-toggleable-md navbar-light">
      <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="icon-bar top-bar" />
        <span className="icon-bar middle-bar" />
        <span className="icon-bar bottom-bar" />
      </button>
      <Link to="/" className="navbar-brand">Nalda</Link>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">Register</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
