import React from "react";
function AdminPanel({ keycloak }) {
    const handleLogoutUser = () =>{
        keycloak.logout();
    }
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
        </div>
        <button onClick={handleLogoutUser}>Logout</button>
      </div>
    </>
  );
}
export default AdminPanel;
