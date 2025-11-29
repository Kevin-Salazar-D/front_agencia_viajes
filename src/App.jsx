import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import HotelDetails from './pages/HotelDetails';
import PackageDetails from './pages/PackageDetails';
import AdminPanel from './pages/AdminPanel';
import AllHotels from './pages/AllHotels';
import Packages from './pages/Packages';
import PaymentGateway from './pages/PaymentGateway';
import AllTransports from './pages/AllTransports'; // 👈 Nuevo import
import TransportDetails from './pages/TransportDetails'; // 👈 Nuevo import

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/paquete/:id" element={<PackageDetails />} />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/hoteles" element={<AllHotels />} />
          <Route path="/paquetes" element={<Packages />} />
          
          {/* 👇 Nuevas rutas para transportes */}
          <Route path="/transportes" element={<AllTransports />} />
          <Route path="/transporte/:id" element={<TransportDetails />} />
          
          <Route path="/payment" element={<PaymentGateway />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;