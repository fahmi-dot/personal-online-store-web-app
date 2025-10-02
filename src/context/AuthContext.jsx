import React, { createContext, useState, useEffect } from "react";
import { getMyProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await getMyProfile(token);
          console.log(response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUser(null);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
