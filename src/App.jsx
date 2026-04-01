import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlerContext";
import { LoadingProvider } from "@/context/LoadingContext";
import AppRoutes from "../src/routes/AppRoutes";



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
