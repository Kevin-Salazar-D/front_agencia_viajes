import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

//Crear endpoints

const trasportService = {
  //crear trasporte
  createTrasport: async (dataTrasport) => {
    const { data } = await api.post(
      API_ROUTES.TRASPORT.CREATE_TRASPORT,
      dataTrasport,
    );
    return data;
  },

  //actulizar trasporte
  updateTrasport: async (dataTrasport) => {
    const { data } = await api.put(
      API_ROUTES.TRASPORT.UPDATE_TRASPORT,
      dataTrasport,
    );
    return data;
  },

  //eliminar trasporte
  deleteTrasport: async (id) => {
    const { data } = await api.delete(API_ROUTES.TRASPORT.DELETE_TRASPORT, {
      id,
    });
    return data;
  },

  //mostrar todos los trasportes
  getTrasport: async () => {
    const { data } = await api.get(API_ROUTES.TRASPORT.GET_TRASPORT);
    return data;
  },

  //mostrar los trasportes por tipo
  getTrasportType: async (type) => {
    const { data } = await api.get(API_ROUTES.TRASPORT.GET_TRASPORT_TYPE, {
      params: {
        tipo: type,
      },
    });
    return data;
  },

  getTrasportID: async (id) => {
    const { data } = await api.get(API_ROUTES.TRASPORT.GET_TRASPORT_ID, { 
      params:{
        id: id
      }
     });
    return data;
  },
};

export default trasportService;
