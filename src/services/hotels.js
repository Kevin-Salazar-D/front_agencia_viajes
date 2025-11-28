import axios from 'axios';

const API_URL = 'http://localhost:3000/agenciaViajes';

// Obtener todos los hoteles
export const getHotels = async () => {
  try {
    const response = await axios.get(`${API_URL}/hoteles/mostrarTodosHoteles`);
    return response;
  } catch (error) {
    console.error('Error obteniendo hoteles:', error);
    throw error;
  }
};

// Obtener hoteles por ciudad
export const getHotelsByCity = async (cityId) => {
  try {
    const response = await axios.get(`${API_URL}/hoteles/mostrarHotelesCiudad`, {
      params: { ciudad_id: cityId }
    });
    return response;
  } catch (error) {
    console.error('Error obteniendo hoteles por ciudad:', error);
    throw error;
  }
};

// Obtener detalles de un hotel específico
export const getHotelDetails = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/hotelDetalles/mostrarDetallesDeUnHotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo detalles del hotel:', error);
    throw error;
  }
};

// Obtener imágenes de un hotel
export const getHotelImages = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/hotelImagenes/mostrarImagenHotel`, {
      params: { hotel_id: hotelId }
    });
    return response;
  } catch (error) {
    console.error('Error obteniendo imágenes del hotel:', error);
    throw error;
  }
};

// Obtener todos los detalles de hoteles
export const getAllHotelDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/hotelDetalles/mostrarTodosDetallesHoteles`);
    return response;
  } catch (error) {
    console.error('Error obteniendo todos los detalles:', error);
    throw error;
  }
};

export default {
  getHotels,
  getHotelsByCity,
  getHotelDetails,
  getHotelImages,
  getAllHotelDetails
};