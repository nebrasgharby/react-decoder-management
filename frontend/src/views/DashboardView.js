import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import ClientsView from './ClientsView';
import DecodersView from './DecodersView';

const DashboardView = ({ user, onLogout }) => {
  return React.createElement('div', { className: 'dashboard fade-in' },
    React.createElement(Sidebar, { user: user, onLogout: onLogout }),
    React.createElement('div', { className: 'main-content' },
      React.createElement(Header, { user: user }),
      React.createElement('div', { className: 'container-fluid' },
        React.createElement(Routes, null,
          React.createElement(Route, {
            path: 'clients',
            element: user.role === 'ADMIN' ?
              React.createElement(ClientsView) :
              React.createElement(Navigate, { to: '/dashboard/decoders', replace: true })
          }),
          React.createElement(Route, {
            path: 'decoders',
            element: React.createElement(DecodersView, { user: user })
          }),
          React.createElement(Route, {
            path: '*',
            element: React.createElement(Navigate, { to: '/dashboard/decoders', replace: true })
          })
        )
      )
    )
  );
};

export default DashboardView;