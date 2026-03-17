import api from "./axiosConfig";
import { API_ROUTES } from "../constants/endpoints";

const PackageService = {
  //crear un paquete
  createPackage: async (dataPackage) => {
    const { data } = await api.post(API_ROUTES.PACKAGE.CREATE_PACKAGE, { dataPackage});
    return data;
  },

  //actualizar un paquete
  createPackage: async (updatePackage) => {
    const { data } = await api.post(API_ROUTES.PACKAGE.UPDATE_PACKAGE, { updatePackage});
    return data;
  },

  //borrar paquete
  deletePackage: async (id)=>{
    const {data} = await  api.delete(API_ROUTES.PACKAGE.DELETE_PACKAGE,{id})
    return data;
  },

  //mostrar todos los paquetes
  getPackages: async()=>{
    const {data} =  await api.get(API_ROUTES.PACKAGE.GET_PACKAGE);
    return data;
  },

  //mostrar los paquetes por ID
  getPackageByid: async (id)=>{
    const {data} = await api.get(`${API_ROUTES.PACKAGE.GET_PACKAGE_ID}/${id}`)
    return data;

  },
    //mostrar los paquetes por ID
  getPackageHotelID: async (hotel_id)=>{
    const {data} = await api.get(`${API_ROUTES.PACKAGE.GET_PACKAGE_HOTEL_ID}/${hotel_id}`)
    return data;

  }

};
export default PackageService;
