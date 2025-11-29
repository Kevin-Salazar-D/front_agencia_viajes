import axios from 'axios';

const API_URL = 'http://localhost:3000/agenciaViajes';

// Obtener todos los pagos
export const getAllPayments = async () => {
  try {
    const response = await axios.get(`${API_URL}/pagos/mostrarTodosPagos`);
    return response;
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    throw error;
  }
};

// Obtener pago por folio
export const getPaymentByFolio = async (folio) => {
  try {
    const response = await axios.get(`${API_URL}/pagos/mostrarPagoPorFolio/${folio}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo pago por folio:', error);
    throw error;
  }
};

// Obtener pago por reservación
export const getPaymentByReservation = async (reservacionId) => {
  try {
    const response = await axios.get(`${API_URL}/pagos/mostrarPagoPorReservacion/${reservacionId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo pago por reservación:', error);
    throw error;
  }
};

// Crear pago
export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/pagos/crearPago`, paymentData);
    return response;
  } catch (error) {
    console.error('Error creando pago:', error);
    throw error;
  }
};

// Actualizar pago
export const updatePayment = async (paymentData) => {
  try {
    const response = await axios.put(`${API_URL}/pagos/actualizarPago`, paymentData);
    return response;
  } catch (error) {
    console.error('Error actualizando pago:', error);
    throw error;
  }
};

// Borrar pago
export const deletePayment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/pagos/borrarPago`, {
      params: { id }
    });
    return response;
  } catch (error) {
    console.error('Error borrando pago:', error);
    throw error;
  }
};

export default {
  getAllPayments,
  getPaymentByFolio,
  getPaymentByReservation,
  createPayment,
  updatePayment,
  deletePayment
};