import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, getProfile } from "../services/auth.api";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function initAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  async function login(email, motDePasse) {
    const data = await loginApi({ email, motDePasse });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = {
    user: user,
    isAuthenticated: user !== null,
    login: login,
    logout: logout,
    loading:loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
