import React, { createContext, useContext, useEffect, useState, useRef} from "react";
import Keycloak from "keycloak-js";
import keycloak from "../keycloak";
// Create context for Auth
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 
  const isRun = useRef(false);
  

  useEffect(() => {
    if(isRun.current){
        return;
    }


    isRun.current = true;
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setIsLoggedIn(true);
      setLoading(false);
    }).catch((error) => {
      console.error("Keycloak initialization failed:", error);
      setLoading(false);
    });
  }, []);

  return (
    <>
    {/* here we are defining what data will be abvailable to the child components that use this context (happens in wrappedapp.jsx)*/}
    <AuthContext.Provider  value={{ isLoggedIn, keycloak, loading}}>
      {children}
    </AuthContext.Provider>   
     </>

  );
};
export default useAuth;
