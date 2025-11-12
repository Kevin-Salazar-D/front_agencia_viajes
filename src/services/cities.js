import api from "./axiosConfig";

// Obtener todas las ciudades
export const getCities = () => api.get("/obtenerTodasCiudades");

// Crear ciudad
export const createCity = (data) => api.post("/crearCiudad", data);

// Actualizar ciudad
export const updateCity = (data) => api.put("/actualizarCiudad", data);

// Borrar ciudad (body con id)
export const deleteCity = (id) => api.delete("/borrarCiudad", { data: { id } });

