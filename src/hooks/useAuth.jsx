import React, { createContext, useContext, useEffect, useState, useRef} from "react";
import Keycloak from "keycloak-js";
import keycloak from "../keycloak";
// Create context for Auth
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 
  const[isAdmin, setIsAdmin] = useState(false);
  const isRun = useRef(false);
  //TODO: make sure we save our jwt token to local storage, so it can be sent in header of each api request
  

  useEffect(() => {
    if(isRun.current){
        return;
    }
    isRun.current = true;
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setIsLoggedIn(true);
      setLoading(false);
      //Here we check if the logged in user (based on their token) has admin role by using the includes function
      if(authenticated){
        const roles = keycloak.tokenParsed?.realm_access.roles;
        setIsAdmin(roles.includes("admin")); 
      }
    }).catch((error) => {
      console.error("Keycloak initialization failed:", error);
      setLoading(false);
    });
  }, []);

  return (
    <>
    {/* here we are defining what data will be abvailable to the child components that use this context (happens in wrappedapp.jsx)*/}
    <AuthContext.Provider  value={{ isLoggedIn, keycloak, loading,isAdmin}}>
      {children}
    </AuthContext.Provider>   
     </>

  );
};
export default useAuth;
