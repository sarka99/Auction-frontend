import React, { useEffect, useState } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import AdminPanel from "./components/AdminPanel";
import Public from "./components/public";
import useAuth from "./hooks/useAuth";
function App() {
  //this is the entry point component
  //const {keycloak} = useKeycloak();
  const {isLoggedIn,keycloak} = useAuth();

  

  
  
  return (
    <>    


    {/*Conditionally render components based on if the user is logged in or not */}
    {console.log(`is the user logged in now ${isLoggedIn}`)}
    {isLoggedIn ? <AdminPanel keycloak= {keycloak}/> : <Public/>}    
    

    </>
  );
}

export default App;