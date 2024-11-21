import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import UsersList from "../../components/UsersList";
function Dashboard() {
    //Using the useAuth custom hook to access values in the Authcontent so that we can get keycloak related state
    const {isLoggedIn, keycloak,isAdmin}  = useAuth();
    useEffect(()=>{
      console.log(`Is user logged in inside adminpanel? ${isLoggedIn}`)
    })
  
    const handleLogoutUser = () =>{
        keycloak.logout();
        
    }
    const handleToggleCreateUser = () =>{
        setShowCreateUser(prev => !prev);
    }
    const displayUserRoles = () =>{
      const roles = keycloak.tokenParsed?.realm_access?.roles || [];      
      console.log(roles)
      return <p>Roles: {roles.join(", ")}</p>;    }
  return ( 
    <>
      <div>
        <UsersList/>
      </div>

      
    </>
  );
}
export default Dashboard;
