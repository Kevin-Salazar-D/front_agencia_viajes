import api from "./axiosConfig";

// Obtener todos los usuarios
// GET /agenciaViajes/usuarios + /obtenerTodosUsuarios
export const getUsers = () => api.get("/agenciaViajes/usuarios/obtenerTodosUsuarios");

// Crear usuario
// POST /agenciaViajes/usuarios + /crearUsuarios
export const createUser = (data) => api.post("/agenciaViajes/usuarios/crearUsuarios", data);

// Actualizar usuario
// PUT /agenciaViajes/usuarios + /actualizarUsuario
export const updateUser = (data) => api.put("/agenciaViajes/usuarios/actualizarUsuario", data);

// Borrar usuario (body con id)
// DELETE /agenciaViajes/usuarios + /eliminarUsuario
export const deleteUser = (id) => api.delete("/agenciaViajes/usuarios/eliminarUsuario", { data: { id } });