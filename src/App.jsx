// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Public from "./components/Public"; // Include your Public component if you have one
import useAuth from "./hooks/useAuth";
import Nav from "./components/Nav";
import Auctions from "./pages/regular-user/Auctions";
import MyAuctions from "./pages/regular-user/MyAuctions";
import AttendedAuctions from "./pages/regular-user/AttendedAuctions";
import WonAuctions from "./pages/regular-user/WonAuctions";
function App() {
  const { isLoggedIn, loading,keycloak,isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Nav /> {/* Include the Nav component */}
        <div style={{ paddingTop: '60px' }}> {/* Adjust padding to prevent content from being hidden under the navbar */}
          <Routes>
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/attended-auctions" element={<AttendedAuctions />} />
            <Route path="/won-auctions" element={<WonAuctions />} />
            {/* Add more routes as needed */}

            {isAdmin && (
              <>
                <Route path="/admin-panel" element={<AdminPanel />} />

              </>
            ) }
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
