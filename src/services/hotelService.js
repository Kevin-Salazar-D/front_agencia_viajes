import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

const cityService = {
  //obtener todos los hoteles
  getHotels: async () => {
    const { data } = await api.get(API_ROUTES.HOTEL.GET_HOTELS);
    return data;
  },

  //Obtener todos los hoteles asociados a una ciudad
  getHotelCity: async (id) => {
        // Usamos 'params' para mandarlo como req.query y lo nombramos 'ciudad_id'
    const { data } = await api.get(API_ROUTES.HOTEL.GET_HOTEL_CITY, {
      params: {
        ciudad_id: id,
      },
    });

    return data;
  },

  //Creamos el hotel
  createHotel: async (cityData) => {
    const { data } = await api.put(API_ROUTES.HOTEL.CREATE_HOTEL, cityData);
    return data;
  },

  //actualizar un hotel
  updateHotel: async (cityData) => {
    const { data } = await api.put(API_ROUTES.HOTEL.UPDATE_HOTEL, cityData);
    return data;
  },

  //actualizar un hotel
  updateHotelCity: async (id, ciudad_id) => {
    const { data } = await api.put(API_ROUTES.HOTEL.UPDATE_HOTEL_CITY, {
      id,
      ciudad_id,
    });
    return data;
  },

  //borrar el hotel
  deleteCity: async (id) => {
    const { data } = await api.put(API_ROUTES.HOTEL.DELETE_HOTEL, { id });
    return data;
  },

  //Traer todos los datos de un hotel
  getDetailsHotel: async () => {
    const { data } = await api.get(API_ROUTES.HOTEL.GET_DETAILS_HOTEL);
    return data;
  },

  // Traer los datos de un solo hotel por ID
  getDetailsHotelID: async (hotel_id) => {
    const { data } = await api.get(`${API_ROUTES.HOTEL.GET_DETAILS_HOTEL_ID}/${hotel_id}`);
    return data;
  },

  // Creamos los detalles de un hotel
  createDetailsHotel: async (dataHotel) => {
    // CORRECCIÓN: Quitamos las llaves { } alrededor de dataHotel
    const { data } = await api.post(API_ROUTES.HOTEL.CREATE_DETAILS_HOTEL, dataHotel);
    return data;
  },

  // Actualizamos los detalles de un hotel
  updateDetailsHotel: async (dataHotel) => {
    const { data } = await api.put(API_ROUTES.HOTEL.UPDATE_DETAILS_HOTEL, dataHotel);
    return data;
  },

  // Eliminar los detalles de un hotel
  deleteDetailsHotel: async (id) =>{
    const {data} = await api.delete(API_ROUTES.HOTEL.DELETE_DETAILS_HOTEL,{
      params:{
        id: id
      }
    });
    return data;
  },

    // Crear una imagen para un hotel
  createImageHotel: async (hotel_id, url, orden) =>{
    const {data} = await api.post(API_ROUTES.HOTEL.CREATE_IMAGE_HOTEL,{
        hotel_id,
        url,
        orden
    });
    return data;
  },

  getImageHotel: async (hotel_id)=>{
      const {data} = await api.get(API_ROUTES.HOTEL.GET_IMAGE_HOTEL, {
        params:{
          hotel_id: hotel_id
        }
      });
      return data;
  },

  updateImageHotel: async (dataImageHotel) =>{
     const {data} = await api.update(API_ROUTES.HOTEL.UPDATE_HOTEL, {
       dataImageHotel
      });
      return data;
  },

   delateImageHotel: async (id) =>{
     const {data} = await api.delete(API_ROUTES.HOTEL.DELETE_IMAGE_HOTEL, {
       id
      });
      return data;
  },


};

export default cityService;
