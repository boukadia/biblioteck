import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, register as registerApi } from "../services/auth.api";

// eslint-disable-next-line react-refresh/only-export-components
const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function initAuth() {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser && storedUser !== "undefined") {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  async function login(email, motDePasse) {
    try {
      const data = await loginApi({ email, motDePasse });
      
      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function register(userData) {
    try {
      const data = await registerApi(userData);
      
      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = {
    user: user,
    token: token,
    isAuthenticated: !!token,
    login: login,
    register: register,
    logout: logout,
    loading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
