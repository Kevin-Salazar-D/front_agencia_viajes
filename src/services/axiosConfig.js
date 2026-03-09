import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL_BASE ||
  "http://localhost:3000/agenciaViajes";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR GLOBAL DE RESPUESTA
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    //  Token expirado o no autorizado
    if (status === 401) {
      console.warn("Sesión expirada o no autorizada");

      window.dispatchEvent(new Event("unauthorized"));
    }

    // 🧠 Normalizamos el error
    const customError = {
      status,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error en el servidor",
    };

    return Promise.reject(customError);
  }
);

export default api;