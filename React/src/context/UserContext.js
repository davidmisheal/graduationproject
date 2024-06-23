import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const userLogout = () => {
    window.localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("userData");

    setUser(null); // Clear user from context
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear JWT cookie
  };

  return (
    <UserContext.Provider value={{ user, setUser, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};
