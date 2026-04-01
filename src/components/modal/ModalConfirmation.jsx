import React from 'react';
import icons from "@/constants/icons";
import { useNavigate } from "react-router-dom";
import "@/styles/ModalConfirm.css"; 

const ModalConfirm = ({ 
  type = "info", 
  title = "", 
  message = "", 
  onConfirm, 
  onClose,
  confirmText = "Confirmar",
  cancelText = "Cancelar" ,
  navigateRoute = '/'
}) => {

  const navigate = useNavigate();
  const getIcon = (type) => {
    switch (type) {
      case 'delete': return icons.trashMedium; 
      case 'navigation': return icons.arowUpRightMedium; 
      case 'warning': return icons.alert; 
      default: return icons.infoMedium;
    }
  };

  const handleConfirm  = () =>{
    onConfirm();
    if (navigateRoute && navigateRoute !== '/') {
      navigate(navigateRoute);
    }
  }

  const handleClose  = () =>{
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-confirm-container modal-border-${type}`}>
        
        <button className="modal-close-x" onClick={handleClose}>
          {icons.close}
        </button>

        <div className="modal-confirm-content">
          <div className={`modal-confirm-icon icon-${type}`}>
            {getIcon(type)}
          </div>
          
          <div className="modal-text">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-confirm-actions">
          <button className="btn-modal-cancel" onClick={handleClose}>
            {cancelText}
          </button>
          <button 
            className={`btn-modal-confirm btn-confirm-${type}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;