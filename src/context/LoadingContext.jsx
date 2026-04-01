import React, { createContext, useContext, useState } from "react";
import "@/styles/Loading.css";
import { Loader } from "lucide-react";

// Creamos el contexto
const LoadingContext = createContext();

// Creamos el provider
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Cargando...");

  // Mostramos el loading
  const showLoading = (text = "Cargando...") => {
    setLoadingText(text);
    setLoading(true);
  };

  // 1. CORRECCIÓN: Le cambiamos el nombre a hideLoading
  const hideLoading = () => {
    setLoadingText("Cargando..."); // Reseteamos el texto por limpieza
    setLoading(false);
  };

  return (
    // 2. CORRECCIÓN: Exportamos hideLoading en el value
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}

      {loading && (
        <div className="global-loader-overlay">
          <div className="global-loader-content">
            <Loader size={56} strokeWidth={2.5} className="global-spinner" />
            <p className="global-loader-text">{loadingText}</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);