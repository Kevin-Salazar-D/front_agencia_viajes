import { Route } from "react-router-dom";

import PublicLayout from "@/layout/PublicLayout";
import AuthLayout from "@/layout/AuthLayout";

//importamos el autenticador de rutas
import GuestRoute from "@/guards/GuestRoute";
import Home from "@/pages/pagePublic/Home";
import Packages from "@/pages/pagePublic/Packages";
import Destination from "@/pages/pagePublic/AllHotels";
import AllTransports from "@/pages/pagePublic/AllTransports";
import TransportDetails from "@/pages/pagePublic/TransportDetails";
import HotelDetails from "@/pages/pagePublic/HotelDetails";
import PackageDetails from "@/pages/pagePublic/PackageDetails";
import JourneyDestiny from "@/pages/pagePublic/Results";
// Pages de autorizacion
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";


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
      <Route path="/paquete/:id" element={<PackageDetails />} />

       {/* Resultado de la busqueda  */}
      <Route path="/journeyDestiny/:origenId/:destinoId" element={<JourneyDestiny />} />
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
