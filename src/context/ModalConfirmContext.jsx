import { createContext, useContext, useState } from "react";

//importamos nuestro componente
import ModalConfirm from "@/components/modal/ModalConfirmation";

//paso 1: creamos contexto
const ModalContext = createContext();

//paso2: creamos nuestro provider el quien se encarga proveer todas las funciones de nuestro modal
export const ModalProvider = ({ children }) => { // 🌟 AGREGADO: export
  //hacemos una estado para pasar los props de nuestro provider
  const [modalState, setModalState] = useState({
    isOpen: false, 
    type: "info",
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    navigateRoute: "/",
    resolvePromise: null,
  });

  //paso 3 Hacemos las funciones que hara nuestro modal
  const showModal = async (options) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true, 
        type: options.type || "info",
        title: options.title || "",
        message: options.message || "",
        confirmText: options.confirmText || "",
        cancelText: options.cancelText || "",
        navigateRoute: options.navigateRoute || "/",
        resolvePromise: resolve,
      });
    });
  };

  //cerramos el modal
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, resolvePromise: null }));
  };
  //cuando el usuario confirmo una accion
  const handleConfirm = () => {
    if (modalState.resolvePromise) {
      modalState.resolvePromise(true);
    }
    closeModal();
  };

  //cuando el usario no quiere realizar la opcion
  const handleCancel = ()=>{
    if(modalState.resolvePromise){
        modalState.resolvePromise(false)
    }
    closeModal();
  }

  //hacemos nuestro provider para renderizar el componentre
  return ( 
  <ModalContext.Provider value={{showModal}}>
    {children}
    {modalState.isOpen && ( 
      <ModalConfirm
          type= {modalState.type}
          title= {modalState.title}
          message = {modalState.message}
          confirmText={modalState.confirmText}
          cancelText={modalState.cancelText}
          navigateRoute={modalState.navigateRoute}
          onConfirm={handleConfirm}
          onClose={handleCancel}
      />
    )}
  </ModalContext.Provider>
  );
};

export const useModal = ()=> useContext(ModalContext);