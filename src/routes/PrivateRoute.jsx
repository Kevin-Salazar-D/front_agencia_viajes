import { Route } from "react-router-dom";
import PrivateLayout from "@/layout/PrivateLayout";
import ProtectedRoute from "@/guards/ProtectedRoute";

// Importamos el componente "cerebro" que maneja ambas vistas
import Profile from "@/pages/pageUser/Profile"; 

const PrivateRoute = (
  <>
    <Route element={<ProtectedRoute allowedRole={"user"}/>}>
      <Route element={<PrivateLayout/>}>
        
        {/* Vista de Información Personal */}
        <Route path="/perfil" element={<Profile />} />
        
        {/* Vista de Seguridad (Punto 2 y 3) */}
        {/* Ambas rutas cargan Profile, y el componente decide qué mostrar */}
        <Route path="/perfil/seguridad" element={<Profile />} />
        
        {/* Mantenemos esta por si el Sidebar usa la ruta corta */}
        <Route path="/seguridad" element={<Profile />} />

      </Route>
    </Route>
  </>
);

export default PrivateRoute;