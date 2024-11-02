import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CreateUser from "./CreateUser";
function AdminPanel() {
    //Using the useAuth custom hook to access values in the Authcontent so that we can get keycloak related state
    const {isLoggedIn, keycloak,isAdmin}  = useAuth();
    const [showCreateUser,setShowCreateUser] = useState(false);
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
        <h1>This is the admins panel</h1>
        <div>
          <h2>Welcome, {keycloak.tokenParsed?.preferred_username}</h2>
          <p>Email: {keycloak.tokenParsed?.email}</p>
          <p>First Name: {keycloak.tokenParsed?.given_name}</p>
          <p>Last Name: {keycloak.tokenParsed?.family_name}</p>
          <p>Your ID is: {keycloak.tokenParsed?.sub}</p>
          <p>Your token is: {keycloak.token}</p>
          {isAdmin ? <p>Logged in User has admin role</p> : <p>User doesnt have admin role</p>}
          {displayUserRoles()}


        </div>
        <button onClick={handleLogoutUser}>Logout</button>      
        <button onClick={handleToggleCreateUser}>Add user</button>
        {showCreateUser ? <CreateUser/> : null}

      </div>

      
    </>
  );
}
export default AdminPanel;
