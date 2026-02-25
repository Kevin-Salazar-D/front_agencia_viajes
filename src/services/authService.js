import axios from 'axios';

// Extraemos la URL de las variables de entorno (.env)
// Si no existe, usa localhost:4000 por defecto
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // INDISPENSABLE para enviar/recibir cookies HTTP-only
});

export const authService = {
    /**
     * Paso 1: Login tradicional
     * @returns {Promise} { requiere2FA: boolean, userId?: number, usuario?: object }
     */
    login: async (credentials) => {
        const { data } = await api.post('/login', credentials);
        return data;
    },

    /**
     * Paso 2: Verificación de código tras el Login (si requiere2FA es true)
     * Backend: verificarAuth2FA
     */
    verificarAuth2FA: async (userId, codigo) => {
        const { data } = await api.post('/verificar-auth-2fa', { userId, codigo });
        return data;
    },

    /**
     * Activación Inicial: Generar el QR
     * Backend: activarDosPasos (Usa el ID del JWT de la cookie)
     */
    activarDosPasos: async () => {
        const { data } = await api.get('/activar-dos-pasos');
        // Según tu back, esto devuelve: { mensaje: "...", codigoQR: "..." }
        return data;
    },

    /**
     * Confirmación Inicial: Validar el primer escaneo del QR
     * Backend: confirmarDosPasos
     */
    confirmarDosPasos: async (codigo) => {
        const { data } = await api.post('/confirmar-dos-pasos', { codigo });
        return data;
    },

    /**
     * Cerrar Sesión
     * Backend: logout (Limpia la cookie del navegador)
     */
    logout: async () => {
        const { data } = await api.post('/logout');
        return data;
    }
};

export default authService;