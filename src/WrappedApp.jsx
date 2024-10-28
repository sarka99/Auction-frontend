// src/WrappedApp.jsx
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak'; // Import the Keycloak instance
import App from './App.jsx';

const WrappedApp = () => (
    <ReactKeycloakProvider authClient={keycloak}>
        <App />
    </ReactKeycloakProvider>
);

export default WrappedApp;
