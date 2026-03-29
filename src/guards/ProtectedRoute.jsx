import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlerContext";

const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, loading, userAuth } = useAuth();
  const { warning } = useAlert();

  // Mientras se verifica la sesión
  if (loading) return null;

  // Obtenemos el rol del usuario
  const rol = userAuth?.rol;

  // Si no está autenticado, lo llevamos al home
  if (!isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  const invader = allowedRole && rol !== allowedRole && rol === "user";

  useEffect(() => {
    if (invader) {
      warning(
        "Acceso No autorizado",
        "No tienes acceso para estar en esta ruta"
      );
    }
  }, [invader, warning]);

  // si no esta autorizado para entrar a una ruta lo mandamos al home
  if (invader) { 
    return <Navigate to={"/"} replace />;
  }

  //si tofo esta bien dejamos que el usuario entre a las rutas
  return <Outlet />;
};

export default ProtectedRoute;