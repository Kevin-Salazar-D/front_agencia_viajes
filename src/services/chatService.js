
import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

export const sendChatMessage = async (message, history) => {
  try {
    // hAcemos el post 
    const response = await api.post(API_ROUTES.IA.CHAT, { 
      message, 
      history 
    });

    //convertimos la data en string
    return response.data.reply;

  } catch (error) {
  
    console.error('Error en sendChatMessage:', error.message || error);
    throw error;
  }
};