import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Rutas públicas */}
      {PublicRoutes}

      {/* Rutas privadas */}
      {PrivateRoute}

    </Routes>
  );
};

export default AppRoutes;