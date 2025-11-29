import axios from 'axios';

const API_URL = 'http://localhost:3000/agenciaViajes';

// Obtener todos los paquetes
export const getAllPackages = async () => {
  try {
    const response = await axios.get(`${API_URL}/paquetes/mostrarTodosPaquetes`);
    return response;
  } catch (error) {
    console.error('Error obteniendo paquetes:', error);
    throw error;
  }
};

// Obtener paquete por ID
export const getPackageById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/paquetes/mostrarPaquete/${id}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo paquete por ID:', error);
    throw error;
  }
};

// Obtener paquetes por hotel
export const getPackagesByHotel = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/paquetes/mostrarPaquetesPorHotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo paquetes por hotel:', error);
    throw error;
  }
};

// Crear paquete (admin)
export const createPackage = async (packageData) => {
  try {
    const response = await axios.post(`${API_URL}/paquetes/crearPaquete`, packageData);
    return response;
  } catch (error) {
    console.error('Error creando paquete:', error);
    throw error;
  }
};

// Actualizar paquete (admin)
export const updatePackage = async (packageData) => {
  try {
    const response = await axios.put(`${API_URL}/paquetes/actualizarPaquete`, packageData);
    return response;
  } catch (error) {
    console.error('Error actualizando paquete:', error);
    throw error;
  }
};

// Borrar paquete (admin)
export const deletePackage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/paquetes/borrarPaquete`, {
      params: { id }
    });
    return response;
  } catch (error) {
    console.error('Error borrando paquete:', error);
    throw error;
  }
};

export default {
  getAllPackages,
  getPackageById,
  getPackagesByHotel,
  createPackage,
  updatePackage,
  deletePackage
};