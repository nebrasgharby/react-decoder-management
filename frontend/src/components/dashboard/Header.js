import React from 'react';

const Header = ({ user }) => {
  return React.createElement('header', { className: 'mb-4' },
    React.createElement('div', { className: 'd-flex justify-content-between align-items-center' },
      React.createElement('h1', null, 'Dashboard'),
      React.createElement('div', { className: 'd-flex align-items-center' },
        React.createElement('span', { className: 'mr-2' }, `Welcome, ${user.nom}`),
        React.createElement('div', { className: 'avatar' },
          React.createElement('i', { className: 'fas fa-user-circle fa-2x' })
        )
      )
    )
  );
};

export default Header;