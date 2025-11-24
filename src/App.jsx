import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import HotelDetails from './pages/HotelDetails';  // 👈 IMPORTAR

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
          <Route path="/hotel/:id" element={<HotelDetails />} />  {/* 👈 NUEVA RUTA */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;