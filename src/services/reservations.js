import axios from 'axios';

const API_URL = 'http://localhost:3000/agenciaViajes';

// Obtener todas las reservaciones
export const getAllReservations = async () => {
  try {
    const response = await axios.get(`${API_URL}/reservaciones/mostrarTodasReservaciones`);
    return response;
  } catch (error) {
    console.error('Error obteniendo reservaciones:', error);
    throw error;
  }
};

// Obtener reservación por número de reserva
export const getReservationByNumber = async (numeroReserva) => {
  try {
    const response = await axios.get(`${API_URL}/reservaciones/mostrarReservacion/${numeroReserva}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo reservación:', error);
    throw error;
  }
};

// Crear reservación
export const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(`${API_URL}/reservaciones/crearReservacion`, reservationData);
    return response;
  } catch (error) {
    console.error('Error creando reservación:', error);
    throw error;
  }
};

// Actualizar reservación
export const updateReservation = async (reservationData) => {
  try {
    const response = await axios.put(`${API_URL}/reservaciones/actualizarReservacion`, reservationData);
    return response;
  } catch (error) {
    console.error('Error actualizando reservación:', error);
    throw error;
  }
};

// Borrar reservación
export const deleteReservation = async (numeroReserva) => {
  try {
    const response = await axios.delete(`${API_URL}/reservaciones/borrarReservacion`, {
      params: { numero_reserva: numeroReserva }
    });
    return response;
  } catch (error) {
    console.error('Error borrando reservación:', error);
    throw error;
  }
};

export default {
  getAllReservations,
  getReservationByNumber,
  createReservation,
  updateReservation,
  deleteReservation
};