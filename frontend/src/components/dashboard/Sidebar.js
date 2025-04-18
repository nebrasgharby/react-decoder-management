import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/auth');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header name_logo">
                <h3>Decoder System</h3>
            </div>
            
            <nav className="sidebar-nav">
                <ul className="nav flex-column">
                    <li className="nav-item lists">
                        <NavLink 
                            to="/dashboard/decoders" 
                            className="nav-link listsa" 
                            activeClassName="active"
                        >
                            <i className="fas fa-satellite-dish mr-2"></i>
                            Decoders
                        </NavLink>
                    </li>
                    
                    {user.role === 'ADMIN' && (
                        <li className="nav-item lists">
                            <NavLink 
                                to="/dashboard/clients" 
                                className="nav-link listsa" 
                                activeClassName="active"
                            >
                                <i className="fas fa-users l-5"></i>
                                Clients
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            
            <div className="sidebar-footer">
                <button 
                    className="btn btn-danger btn-block logoutB" 
                    onClick={handleLogout}
                >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;