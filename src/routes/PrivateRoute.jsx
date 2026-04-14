import { Route } from "react-router-dom";
import PrivateLayout from "@/layout/PrivateLayout";
import ProtectedRoute from "@/guards/ProtectedRoute";
import Profile from "@/pages/pageUser/Profile"; 
import SecurityTab from "@/components/users/SecurityTab"; 

const PrivateRoute = (
  <>
    <Route element={<ProtectedRoute allowedRole={"user"}/>}>
      <Route element={<PrivateLayout/>}>
        <Route path="/perfil" element={<Profile />} />
        <Route path="/seguridad" element={<SecurityTab />} />
        <Route path="/perfil/seguridad" element={<SecurityTab />} />
      </Route>
    </Route>
  </>
);

export default PrivateRoute;