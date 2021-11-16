import React, { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [userToken, setUserToken] = useState(
    JSON.parse(localStorage.getItem("userToken")) || ""
  );
  const [showNavBar, setShowNavBar] = useState(
    JSON.parse(localStorage.getItem("showNavBar")) || false
  );

  const setUserAndLocal = (userToken) => {
    localStorage.setItem("userToken", JSON.stringify(userToken));
    setUserToken(userToken);
  };

  const setShowNavBarAndLocal = (showNavBar) => {
    localStorage.setItem("showNavBar", JSON.stringify(showNavBar));
    setShowNavBar(showNavBar);
  };

  return (
    <UserContext.Provider
      value={{
        userToken,
        setUserToken: setUserAndLocal,
        showNavBar,
        setShowNavBar: setShowNavBarAndLocal,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
