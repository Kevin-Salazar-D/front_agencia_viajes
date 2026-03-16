//creamos los endpoits para consumirlos
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/autenticacion/registro", 
    REGISTER: "/autenticacion/crearCuenta",
    LOGOUT: "/autenticacion/cerrarSesion",
    VERIFY_2FA: "/autenticacion/verificarAuth2FA",
    ACTIVATE_2FA: "/autenticacion/activarDosPasos",
    CONFIRM_2FA: "/autenticacion/confirmarDosPasos",
    PERFIL: "/autenticacion/perfil",
  },
  CITY: {
    GET_CITIES: "/ciudades/obtenerTodasCiudades",
    CREATE_CITIES: "/ciudades/crearCiudad",
    UPDATE_CITIES: "/ciudades/actualizarCiudad",
    DELETE_CITIES_ID: "/ciudades/borrarCiudad",
  },
  HOTEL: {
    //OBTENER HOTELES
    GET_HOTELS: "/hoteles/mostrarTodosHoteles",
    GET_HOTEL_CITY: "/hoteles/mostrarHotelesCiudad",
    GET_DETAILS_HOTEL: "/hotelDetalles/mostrarTodosDetallesHoteles",
    GET_DETAILS_HOTEL_ID: "/hotelDetalles/mostrarDetallesDeUnHotel",
    GET_IMAGE_HOTEL: "/hotelImagenes/mostrarImagenHotel",

    //CREAR HOTELES
    CREATE_HOTEL: "/hoteles/crearHotel",
    CREATE_DETAILS_HOTEL: "/hotelDetalles/crearDetallesHotel",
    CREATE_IMAGE_HOTEL: "/hotelImagenes/crearImagenHotel",

    //ACTUALIZAR HOTELES
    UPDATE_HOTEL: "/hoteles/actualizarHotel",
    UPDATE_HOTEL_CITY: "/hoteles/actualizarCiudadIdHotel",
    UPDATE_DETAILS_HOTEL: "/hotelDetalles/actualizarDetallesHotel",
    UPDATE_IMAGE_HOTEL: "/hotelImagenes/actualizarImagenHotel",

    //ELIMINAR HOTELES
    DELETE_HOTEL: "/hoteles/borrarHotel",
    DELETE_DETAILS_HOTEL: "/hotelDetalles/borrarDetalleHotel",
    DELETE_IMAGE_HOTEL: "/hotelImagenes/borrarImagenHotel",
  },
  TRASPORT: {
    GET_TRASPORT: "/transportes/obtenerTodosTransportes",
    GET_TRASPORT_TYPE: "/transportes/buscarTransportePorTipo",
    GET_TRASPORT_ID: "/transportes/buscarTransportePorId",
    CREATE_TRASPORT: "/transportes/crearTransporte",
    UPDATE_TRASPORT: "/transportes/actualizarTransporte",
    DELETE_TRASPORT: "/transportes/eliminarTransporte"

  },
  PACKAGE:{
    GET_PACKAGE: "/paquetes/mostrarTodosPaquetes",
    GET_PACKAGE_ID: "/paquetes/mostrarPaquete",
    GET_PACKAGE_HOTEL_ID: "/paquetes/mostrarPaquetesPorHotel",
    CREATE_PACKAGE: "/paquetes/crearPaquete",
    UPDATE_PACKAGE: "/paquetes/actualizarPaquete",
    DELETE_PACKAGE: "/paquetes/borrarPaquete"

  }
};

export default API_ROUTES;
