import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlerContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { ModalProvider } from "@/context/ModalConfirmContext";
import AppRoutes from "../src/routes/AppRoutes";
import Chatbot from "./components/chat/Chatbot"; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <ModalProvider>
            <LoadingProvider>
              <AppRoutes />
              <Chatbot />
            </LoadingProvider>
          </ModalProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;