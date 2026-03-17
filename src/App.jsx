import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlerContext";
import { LoadingProvider } from "./context/LoadingContext";
import AppRoutes from "../src/routes/AppRoutes";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Results from "./pages/Results";
import HotelDetails from "./pages/HotelDetails";
import PackageDetails from "./pages/PackageDetails";
import AdminPanel from "./pages/AdminPanel";
import AllHotels from "./pages/AllHotels";
import Packages from "./pages/Packages";
import PaymentGateway from "./pages/PaymentGateway";
import AllTransports from "./pages/AllTransports"; // 👈 Nuevo import
import TransportDetails from "./pages/TransportDetails"; // 👈 Nuevo import

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <LoadingProvider>
            <AppRoutes />
          </LoadingProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
