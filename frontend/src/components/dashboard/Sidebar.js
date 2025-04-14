import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
      onLogout();
      navigate('/auth');
    };

  return React.createElement('div', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-header name_logo'  },
      React.createElement('h3', null, 'Decoder System')
    ),
    React.createElement('nav', { className: 'sidebar-nav' },
      React.createElement('ul', { className: 'nav flex-column' },
        React.createElement('li', { className: 'nav-item lists' },
          React.createElement(NavLink, {
            to: '/dashboard/decoders',
            className: 'nav-link listsa',
            activeClassName: 'active'
          }, 
            React.createElement('i', { className: 'fas fa-satellite-dish mr-2 ' }),
            'Decoders'
          )
        ),
        user.role === 'ADMIN' &&
          React.createElement('li', { className: 'nav-item lists' },
            React.createElement(NavLink, {
              to: '/dashboard/clients',
              className: 'nav-link listsa ',
              activeClassName: 'active'
            },
              React.createElement('i', { className: 'fas fa-users l-5 ' }),
              'Clients'
            )
          )
      )
    ),
    React.createElement('div', { className: 'sidebar-footer' },
      React.createElement('button', {
        className: 'btn btn-danger btn-block logoutB',
        onClick: handleLogout
      },
        React.createElement('i', { className: 'fas fa-sign-out-alt mr-2 ' }),
        'Logout'
      )
    )
  );
};

export default Sidebar;