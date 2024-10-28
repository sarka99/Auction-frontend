// src/components/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Nav.css'; // Ensure you have your styles imported

// Make sure to import Font Awesome CSS in your index.js or App.js

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
      <h1 className="title">Auctioneer</h1>
      <div className="navLinks">
        <Link to="/admin" className="link">Admin Panel</Link>
      </div>
      <div className="userInfo">
        {isLoggedIn ? (
          <>
            <div className="userDetails">
              <span className="username">{keycloak.tokenParsed?.preferred_username}</span>
              <span className="email">{keycloak.tokenParsed?.email}</span>
            </div>
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="button">Login</button>
        )}
      </div>
    </nav>
  );
};

// Add the icon style here for uniform spacing


export default Nav;
