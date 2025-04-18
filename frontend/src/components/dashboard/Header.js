import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ user }) => {
  return (
    <header className="mb-5 p-4 bg-light rounded shadow" style={{ fontSize: '1.2rem' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <h1 className="m-0 display-4 text-primary">
          <i className="fas fa-tachometer-alt me-3"></i>
          Dashboard
        </h1>
        <div className="d-flex align-items-center">
          <span className="me-4 fs-3">
            Welcome, <strong className="text-dark">{user.nom}</strong>
          </span>
          <div className="avatar bg-white rounded-circle p-3 shadow">
            <i className="fas fa-user-circle fa-3x text-primary"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired
};

export default Header;