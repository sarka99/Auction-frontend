import { useKeycloak } from "@react-keycloak/web";
import React from "react";

const SecuredPage = () => {
  const {keycloak} = useKeycloak();

  return (
    <div>
      <h1>Welcome to the Protected Page. {keycloak.tokenParsed?.given_name}</h1>
      <p>Your roles are {keycloak.tokenParsed?.realm_access?.roles}</p>
    </div>
  );
};

export default SecuredPage;