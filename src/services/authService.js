import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

export const authService = {
  login: async (usuario, correo, contra) => {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, {
      usuario,
      correo,
      contra,
    });

    return data;
  },

  createAccount: async (dataUsuario) => {
    const { data } = await api.post(API_ROUTES.AUTH.REGISTER, {
      usuario: dataUsuario.usuario,
      correo: dataUsuario.correo,
      contra: dataUsuario.contra,
      nombre: dataUsuario.nombre,
      apellido: dataUsuario.apellido,
      telefono: dataUsuario.telefono,
    });
    return data;
  },

  verificarAuth2FA: async (userId, codigo) => {
   
    const { data } = await api.post(API_ROUTES.AUTH.VERIFY_2FA, {
      userId,
      codigo,
    });

    return data;
  },

  activarDosPasos: async () => {
    const { data } = await api.post(API_ROUTES.AUTH.ACTIVATE_2FA);

    return data;
  },

  confirmarDosPasos: async (codigo) => {
    const { data } = await api.post(API_ROUTES.AUTH.CONFIRM_2FA, {
      codigo,
    });

    return data;
  },

  logout: async () => {
    const { data } = await api.post(API_ROUTES.AUTH.LOGOUT);

    return data;
  },

  perfil: async () => {
    const { data } = await api.get(API_ROUTES.AUTH.PERFIL);

    return data;
  },
};

export default authService;
