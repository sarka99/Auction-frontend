// src/WrappedApp.jsx
import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak"; // Import the Keycloak instance
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import Nav from "./components/Nav.jsx";
const WrappedApp = () => (    
    <AuthProvider >

    <React.StrictMode>
      <App />
     
    </React.StrictMode>
    </AuthProvider>    

);

export default WrappedApp;
