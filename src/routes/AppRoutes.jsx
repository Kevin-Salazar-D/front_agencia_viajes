import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Rutas públicas */}
      {PublicRoutes}

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/perfil" element={<Profile />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;