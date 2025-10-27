import api from "./axiosConfig";

// Obtener todos los usuarios
export const getUsers = () => api.get("/usuarios"); // Ajustar si tu ruta es diferente

// Crear usuario
export const createUser = (data) => api.post("/crearUsuario", data);

// Actualizar usuario
export const updateUser = (data) => api.put("/actualizarUsuario", data);

// Borrar usuario (body con id)
export const deleteUser = (id) => api.delete("/borrarUsuario", { data: { id } });
