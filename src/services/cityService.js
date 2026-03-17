import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

const cityService = {

  getCities: async () => {
    const { data } = await api.get(API_ROUTES.CITY.GET_CITIES);
    return data;
  },

  // Crear ciudad
  createCity: async (cityData) => {
    const { data } = await api.post(
      API_ROUTES.CITY.CREATE_CITIES,
      cityData
    );
    return data;
  },

  
  updateCity: async (cityData) => {
    const { data } = await api.put(
      API_ROUTES.CITY.UPDATE_CITIES,
      cityData
    );
    return data;
  },

 
  deleteCity: async (id) => {
    const { data } = await api.put(
      API_ROUTES.CITY.DELETE_CITIES_ID,
      { id }
    );
    return data;
  },

};

export default cityService;