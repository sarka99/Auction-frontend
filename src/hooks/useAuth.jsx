import React,{createContext, useEffect, useState} from "react";
import Keycloak from "keycloak-js";
const useAuth = () =>{
    //state below is to keep track of users logged in status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [keycloak,setKeycloak] = useState(true);    
    useEffect(()=>{
        // creating a keycloak instance so we later can mandate login screen
        const keycloakInstance = new Keycloak({
            url: import.meta.env.VITE_KEYCLOAK_URL, // The Keycloak server URL
            realm: import.meta.env.VITE_KEYCLOAK_REALM, // The Keycloak realm
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT, // The Keycloak client ID
        });
        keycloakInstance.init({ onLoad: "login-required"}).then((res)=> {
            setIsLoggedIn(true);
            setKeycloak(keycloakInstance);
        });



    },[])
  
   
    return {isLoggedIn, keycloak}
    
}
export default useAuth;