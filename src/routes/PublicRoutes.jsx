import { Route } from "react-router-dom";

import PublicLayout from "../layout/PublicLayout";
import AuthLayout from "../layout/AuthLayout";

//importamos el autenticador de rutas
import GuestRoute from "./GuestRoute";
// Importamos los pages publicos
import Home from "../pages/Home";
import Packages from "../pages/Packages";
import Destination from "../pages/AllHotels";
import AllTransports from "../pages/AllTransports";
import TransportDetails from "../pages/TransportDetails";
import HotelDetails from "../pages/HotelDetails";

// Pages de autorizacion
import Login from "../pages/Login";
import Register from "../pages/Register";

const PublicRoutes = (
  <>
    {/* Layout principal */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes" element={<Packages />} />
      <Route path="/destinos" element={<Destination />} />

      <Route path="/transportes" element={<AllTransports />} />
      <Route path="/transportes/:id" element={<TransportDetails />} />

      <Route path="/hotel/:id" element={<HotelDetails />} />
    </Route>

    {/* Layout para la autorizacion */}
    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<Register />} />
      </Route>
    </Route>
  </>
);

export default PublicRoutes;
