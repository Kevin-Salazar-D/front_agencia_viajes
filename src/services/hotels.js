import api from "./axiosConfig";

// Prefijo del backend: /agenciaViajes/hoteles

// GET /agenciaViajes/hoteles/mostrarTodosHoteles
export const getHotels = () => api.get("/agenciaViajes/hoteles/mostrarTodosHoteles");

// GET /agenciaViajes/hoteles/mostrarHotelPorId/:id  👈 NUEVA FUNCIÓN
export const getHotelById = (id) => 
  api.get(`/agenciaViajes/hoteles/mostrarHotelPorId/${id}`);

// GET /agenciaViajes/hoteles/mostrarHotelesCiudad
export const getHotelsByCity = (cityId) =>
  api.get("/agenciaViajes/hoteles/mostrarHotelesCiudad", { params: { ciudad_id: cityId } });

// POST /agenciaViajes/hoteles/crearHotel
export const createHotel = (data) => api.post("/agenciaViajes/hoteles/crearHotel", data);

// PUT /agenciaViajes/hoteles/actualizarHotel
export const updateHotel = (data) => api.put("/agenciaViajes/hoteles/actualizarHotel", data);

// PUT /agenciaViajes/hoteles/actualizarCiudadIdHotel
export const updateHotelCity = (data) => api.put("/agenciaViajes/hoteles/actualizarCiudadIdHotel", data);

// DELETE /agenciaViajes/hoteles/borrarHotel
export const deleteHotel = (id) => api.delete("/agenciaViajes/hoteles/borrarHotel", { data: { id } });