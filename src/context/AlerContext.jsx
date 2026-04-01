import { useContext, createContext, useState } from "react";
import { AlertContainer } from "@/components/alerts/Alert";

//creamos el contexto para la alerta global
const AlertContext = createContext();

//creamos el provider
export const AlertProvider = ({children})=>{

     const[alerts, setAlert] = useState([])

     //CREAMOS EL MOSTRAR ALERTA
     const showAlert = (type, title, message, autoClose = 4000) =>{
        const id = Date.now();
        setAlert(prev =>[...prev, {id, type, title, message, autoClose}])
     }

     const removeAlert = (id) =>{
        setAlert(prev=> prev.filter(alert => alert.id !== id))
     }

     //Ingremos los diferentes tipos de Alertas
     const error = (title, message) => showAlert('error', title, message);
     const success = (title, message) => showAlert('success', title, message);
     const warning = (title, message) => showAlert('warning', title, message);
     const info = (title, message) => showAlert('info', title, message);

     return(
        <AlertContext.Provider value={{ error, success, warning, info }}>
            {children}
        <AlertContainer alerts={alerts} removeAlert={removeAlert}/>
        </AlertContext.Provider>
     );


};
     export const useAlert = ()=>useContext(AlertContext);
