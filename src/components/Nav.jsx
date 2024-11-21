// src/components/Nav.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Nav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const { isLoggedIn, keycloak, isAdmin } = useAuth();

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };
  //TODO: come back and fix routing based on user role, view all the right links if regular user or admin and make sure they route to the correct page
  const renderLoggedInRegularUser = () => {
    return (
      <>
        <nav className="navbar">
          <Link to="/admin" className="home-link">
            Auction
          </Link>

          <div className="navLinks">

            <Link to="/auctions" className="link">
              Auctions
            </Link>

            <Link to="/my-auctions" className="link">
              My Auctions
            </Link>

            <Link to="/attended-auctions" className="link">
              Attended Auctions
            </Link>

            <Link to="/won-auctions" className="link">
              Won Auctions
            </Link>
          </div>
          <div className="userInfo">
            {isLoggedIn ? (
              <>
                <div className="userDetails">
                  <span className="username">
                    {keycloak.tokenParsed?.preferred_username}
                  </span>
                  <span className="email">{keycloak.tokenParsed?.email}</span>
                </div>
                <button onClick={handleLogout} className="button">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "0px" }}
                  />
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="button">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginRight: "8px" }}
                />
                Login
              </button>
            )}
          </div>
        </nav>
      </>
    );
  };
  const renderLoggedInAdmin = () => {
    return (
      <>
        <nav className="navbar">
          <Link to="/admin-dashboard" className="home-link">
            Auction
          </Link>
          <div className="navLinks">
            <Link to="/admin-dashboard" className="link">
            Dashboard
            </Link>
       
          </div>
          <div className="userInfo">
            {isLoggedIn ? (
              <>
                <div className="userDetails">
                  <span className="username">
                    {keycloak.tokenParsed?.preferred_username}
                  </span>
                  <span className="email">{keycloak.tokenParsed?.email}</span>
                </div>
                <button onClick={handleLogout} className="button">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "0px" }}
                  />
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="button">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginRight: "8px" }}
                />
                Login
              </button>
            )}
          </div>
        </nav>
      </>
    );
  };

  return <>{isAdmin ? renderLoggedInAdmin() : renderLoggedInRegularUser()}</>;
};

export default Nav;
