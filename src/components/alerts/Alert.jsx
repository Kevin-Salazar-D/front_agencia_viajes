import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '@/styles/Alert.css';

// Constantes
import icons from '@/constants/icons';

// EL COMPONENTE VISUAL DE LA ALERTA INDIVIDUAL
export const Alert = ({ type = 'info', title, message, onClose, autoClose = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error': return icons.alertCircle;
      case 'success': return icons.checkCircleMedium;
      case 'warning': return icons.alertCircle;
      default: return icons.infoMedium;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <p className="alert-message">{message}</p>
      </div>
      <button 
        className="alert-close" 
        onClick={() => { setIsVisible(false); onClose?.(); }}
      >
        {icons.close} 
      </button>
    </div>
  );
};

// 2. EL CONTENEDOR CON EL PORTAL
export const AlertContainer = ({ alerts, removeAlert }) => {
  return createPortal(
    <div className="alert-container">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          autoClose={alert.autoClose}
        />
      ))}
    </div>,
    document.body
  );
};