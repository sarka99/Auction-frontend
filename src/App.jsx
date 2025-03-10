import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import HomePage from "./pages/Homepage";
import SecuredPage from "./pages/Securedpage";
import PrivateRoute from "./helpers/PrivateRoute";
import KeycloakControls from "./components/KeycloakControls";
function App() {
  return (
    <div>
      <ReactKeycloakProvider authClient={keycloak}>
        <React.StrictMode>
          <Nav />
          <KeycloakControls/>

          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route
                path="/secured"
                element={
                  <PrivateRoute>
                    <SecuredPage />
                  </PrivateRoute>
                }
              />
            </Routes>

          </BrowserRouter>
        </React.StrictMode>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;