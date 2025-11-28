import axios from 'axios';

const API_URL = 'http://localhost:3000/agenciaViajes';

// Obtener todos los viajes
export const getAllJourneys = async () => {
  try {
    const response = await axios.get(`${API_URL}/viajes/mostrarTodosLosViajes`);
    return response;
  } catch (error) {
    console.error('Error obteniendo viajes:', error);
    throw error;
  }
};

// Obtener viaje por ID
export const getJourneyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/viajes/mostrarViaje/${id}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo viaje por ID:', error);
    throw error;
  }
};

// Obtener viajes filtrados por ciudad origen y destino
export const getFilteredJourneys = async (origenId, destinoId) => {
  try {
    const response = await axios.get(
      `${API_URL}/viajes/mostrarFiltroViaje/${origenId}/${destinoId}`
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo viajes filtrados:', error);
    throw error;
  }
};

export default {
  getAllJourneys,
  getJourneyById,
  getFilteredJourneys
};