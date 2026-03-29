import { Route } from "react-router-dom";

//layouts
import PrivateLayout from "../layout/PrivateLayout";
//guards
import ProtectedRoute from "../guards/ProtectedRoute";
//pages
import Profile from "../pages/Profile"; 

const PrivateRoute = (
  <>
   <Route element={<ProtectedRoute allowedRole={"user"}/>}>
    <Route element={<PrivateLayout/>}>
      <Route path="/perfil" element={<Profile />} />
    </Route>

   </Route>
  </>
);

export default PrivateRoute;