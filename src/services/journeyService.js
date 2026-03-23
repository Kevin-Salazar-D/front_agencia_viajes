import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

//CREAMOS EL OBJETO
const journeyService = {

    //crear un viaje
    createJourney: async (dataJourney)=>{
        const data = await api.post(API_ROUTES.JOURNEY.CREATE_JOURNEY,dataJourney);
        return data;
    },

    //actualizar un viaje
    updateJourney: async (dataJourney)=>{
        const data = await api.put(API_ROUTES.JOURNEY.UPDATE_JOURNEY,dataJourney);
        return data;
    },

    //borrar un viaje
    deleteJourney: async (id)=>{
        const data = await api.delete(API_ROUTES.JOURNEY.DELETE_JOURNEY ,{id});
        return data;
    },

    //traer todos los viajes
    getJourneys: async()=>{
        const data = await api.get(API_ROUTES.JOURNEY.GET_JOURNEYS);
        return data;
    },

    //obtner un viaje por ID
    getJourneyByID: async(id)=>{
       const { data } = await api.get(`${API_ROUTES.JOURNEY.GET_JOURNEY_ID}/${id}`);
       return data;
    },

    //filtra los viajes por ciudad de origen y destinoi
    getFilterJourney: async(ciudad_origen, ciudad_destino)=>{
       const { data } = await api.get(`${API_ROUTES.JOURNEY.GET_FILTER_JOURNEY}/${ciudad_origen}/${ciudad_destino}`);
       return data;
    },




};

export default journeyService;
