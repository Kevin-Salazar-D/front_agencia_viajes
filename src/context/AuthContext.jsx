import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(true);

   //Verificamos que la sesión este activa
 const checkAuth = async () => {
  try {
    console.log("Entra")
    const data = await authService.perfil();
    setUserAuth(data.usuario);

  } catch (error) {
    setUserAuth(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    checkAuth();

    // cuando el cookie expire
    const handleUnauthorized = () => {
      setUserAuth(null);
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);

   //cuando el usuaio se logea  traemos los datos
  const login = (userData) => {
    setUserAuth(userData);
  };

  
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error cerrando sesión:", error.message);
    } finally {
      setUserAuth(null);
    }
  };

  const value = {
    userAuth,
    loading,
    login,
    logout,
    isAuthenticated: !!userAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};