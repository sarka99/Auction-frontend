// src/components/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Nav.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Nav = () => {
  const { isLoggedIn, keycloak } = useAuth();

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <nav className="navbar">
      <h1 className="title">Auction</h1>
      <div className="navLinks">
        <Link to="/admin" className="link">
          <FontAwesomeIcon icon={faUserShield} style={{ marginRight: '8px' }} />
          Admin Panel
        </Link>
      </div>
      <div className="userInfo">
        {isLoggedIn ? (
          <>
            <div className="userDetails">
              <span className="username">{keycloak.tokenParsed?.preferred_username}</span>
              <span className="email">{keycloak.tokenParsed?.email}</span>
            </div>
            <button onClick={handleLogout} className="button">
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0px' }} />
              
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="button">
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
