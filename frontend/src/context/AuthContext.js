import React, { createContext, useState, useContext } from "react";
import api from "../api";

const AuthContext = createContext();

// --- THIS IS THE FIX ---
// Get the token from storage *before* the component renders
const storedToken = localStorage.getItem("access_token");

// If the token exists on app load, set it on the api instance *immediately*
if (storedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}
// --- END FIX ---

export const AuthProvider = ({ children }) => {
  // Set the initial state from the token we just loaded
  const [token, setToken] = useState(storedToken);

  const login = (newToken) => {
    // 1. Save to local storage
    localStorage.setItem("access_token", newToken);
    // 2. Set on the api instance
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    // 3. Set in React state
    setToken(newToken);
  };

  const logout = () => {
    // 1. Remove from local storage
    localStorage.removeItem("access_token");
    // 2. Remove from api instance
    delete api.defaults.headers.common["Authorization"];
    // 3. Remove from React state
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
