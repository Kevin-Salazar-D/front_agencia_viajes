import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

const userService = {
  //crear un usuario
  createUser: async (dataUser) => {
    const { data } =  await api.post(API_ROUTES.USER.CREATE_USER, dataUser);
    return data;
  },

  //actualizar un usuario
  updateUser: async (dataUser) => {
    const { data } = await api.put(API_ROUTES.USER.UPDATE_USER, dataUser);
    return data;
  },

  //borrar el usuario
  deleteUser: async (id) => {
    const { data } = await api.delete(API_ROUTES.USER.DELETE_USER, id);
    return data;
  },
  //traer todos los usuarios
  getAllUsers: async () => {
    const { data } = await api.get(API_ROUTES.USER.GET_USERS);
    return data;
  },

  //obtener un usuario en especifico
  getUserByID: async (id) => {
    const { data } = await api.get(`${API_ROUTES.USER.GET_USER_ID}/${id}`);
     return data;
  },

   //obtener un usuario en especifico
  getUserByEmail: async (correo) => {
     const { data } = await api.get(`${API_ROUTES.USER.GET_USER_EMAIL}/${correo}`);
     return data;
  },
};

export default userService;
