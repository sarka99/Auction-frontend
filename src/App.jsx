// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Public from "./components/Public"; // Include your Public component if you have one
import useAuth from "./hooks/useAuth";
import Nav from "./components/Nav";

function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Nav /> {/* Include the Nav component */}
        <div style={{ paddingTop: '60px' }}> {/* Adjust padding to prevent content from being hidden under the navbar */}
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/" element={<Public />} /> {/* Assuming you want a public home page */}
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
