import api from "./axiosConfig";

// Obtener todas las ciudades
// GET /agenciaViajes/ciudades/obtenerTodasCiudades
export const getCities = () => api.get("/agenciaViajes/ciudades/obtenerTodasCiudades");

// Crear ciudad
// POST /agenciaViajes/ciudades/crearCiudad
export const createCity = (data) => api.post("/agenciaViajes/ciudades/crearCiudad", data);

// Actualizar ciudad
// PUT /agenciaViajes/ciudades/actualizarCiudad
export const updateCity = (data) => api.put("/agenciaViajes/ciudades/actualizarCiudad", data);

// Borrar ciudad
// DELETE /agenciaViajes/ciudades/borrarCiudad
export const deleteCity = (id) => api.delete("/agenciaViajes/ciudades/borrarCiudad", { data: { id } });