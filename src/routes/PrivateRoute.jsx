import { Route } from "react-router-dom";
import PrivateLayout from "@/layout/PrivateLayout";
import ProtectedRoute from "@/guards/ProtectedRoute";

// Importamos el componente "cerebro" que maneja ambas vistas
import Profile from "@/pages/pageUser/Profile"; 
import ProfileSecurity from "@/pages/pageUser/SecurityTab";

const PrivateRoute = (
  <>
    <Route element={<ProtectedRoute allowedRole={"user"}/>}>
      <Route element={<PrivateLayout/>}>
        
        {/* Vista de Información Personal */}
        <Route path="/perfil" element={<Profile />} />
        <Route path="/perfil/inicio" element={<Profile />} />
        <Route path="/perfil/seguridad" element={<ProfileSecurity />} />
        

      </Route>
    </Route>
  </>
);

export default PrivateRoute;