// src/keycloak.js
import Keycloak from 'keycloak-js';

// File is used to create a new instance of keycloak, only one instance can be created
const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL, // The keycloak server URL
    realm: import.meta.env.VITE_KEYCLOAK_REALM,          // The Keycloak realm
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,     // The Keycloak client ID
});

// Ensure the instance is initialized only once
export default keycloak;
