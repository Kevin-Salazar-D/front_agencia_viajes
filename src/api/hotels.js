import api from "./axiosConfig";

// Obtener todos los hoteles
export const getHotels = () => api.get("/mostrarTodosHoteles");

// Obtener hoteles por ciudad (se pasa ciudad_id como query param)
export const getHotelsByCity = (cityId) =>
  api.get("/mostrarHotelesCiudad", { params: { ciudad_id: cityId } });

// Crear hotel
export const createHotel = (data) => api.post("/crearHotel", data);

// Actualizar hotel
export const updateHotel = (data) => api.put("/actualizarHotel", data);

// Actualizar solo la ciudad del hotel
export const updateHotelCity = (data) => api.put("/actualizarCiudadIdHotel", data);

// Borrar hotel (body con id)
export const deleteHotel = (id) => api.delete("/borrarHotel", { data: { id } });
