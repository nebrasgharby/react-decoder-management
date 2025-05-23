import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import ClientsView from './ClientsView';
import DecodersView from './DecodersView';

const DashboardView = ({ user, onLogout }) => {
  return (
    <div className="dashboard fade-in">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="main-content">
        <Header user={user} />
        
        <div className="container-fluid">
          <Routes>
            <Route 
              path="clients" 
              element={
                user.role === 'ADMIN' 
                  ? <ClientsView /> 
                  : <Navigate to="/dashboard/decoders" replace />
              } 
            />
            <Route 
              path="decoders" 
              element={<DecodersView user={user} />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/dashboard/decoders" replace />} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;