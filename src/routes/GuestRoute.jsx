import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlerContext";

const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const { error, success } = useAlert();
  
  //creamos un ref para validar la primera vez que el usuario inicia sesion
  const isInitialLoading = useRef(isAuthenticated);

  //Mostramos un mensaje de acceso denagado
  useEffect(() => {
    if (isAuthenticated && isInitialLoading.current) {
      error(
        "Acceso denegado",
        "Ya iniciaste sesión, no necesitas entrar aquí.",
      );
    }
  }, [isAuthenticated]);

  // Mientras SE verifica la sesión,
  if (loading) return null;

  //Si ya se inicia sesion lo mandamos al home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  //Si NO ha iniciado sesión
  return <Outlet />;
};

export default GuestRoute;
