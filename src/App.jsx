// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Nav from "./components/Nav";
import Auctions from "./pages/regular-user/Auctions";
import MyAuctions from "./pages/regular-user/MyAuctions";
import AttendedAuctions from "./pages/regular-user/AttendedAuctions";
import WonAuctions from "./pages/regular-user/WonAuctions";
import AuctionDetails from "./pages/regular-user/AuctionDetails";
import CreateAuction from "./components/CreateAuction";
import Dashboard from "./pages/admin/Dashboard";
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
            <Route path="/my-auctions/:userId" element={<MyAuctions />} />

            <Route path="/attended-auctions" element={<AttendedAuctions />} />
            <Route path="/won-auctions" element={<WonAuctions />} />
            <Route path="/auction-details/:auctionId" element={<AuctionDetails />} />
            <Route path="/create-auction" element={<CreateAuction />} />

            {/* Add more routes as needed */}

            {isAdmin && (
              <>
                <Route path="/admin-dashboard" element={<Dashboard />} />

              </>
            ) }
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
