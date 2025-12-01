// src/components/Alert.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import '../styles/Alert.css';

// Componente de alerta individual
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
      case 'error': return <AlertCircle size={24} />;
      case 'success': return <CheckCircle size={24} />;
      case 'warning': return <AlertCircle size={24} />;
      default: return <Info size={24} />;
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
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Contenedor de alertas (para mostrar múltiples)
export const AlertContainer = ({ alerts, removeAlert }) => {
  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          autoClose={alert.autoClose}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

// Hook personalizado para manejar alertas
export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, title, message, autoClose = 4000) => {
    const id = Date.now() + Math.random(); // para evitar duplicados
    setAlerts(prev => [...prev, { id, type, title, message, autoClose }]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return {
    alerts,
    removeAlert,
    showAlert,
    error: (title, message, autoClose) => showAlert('error', title, message, autoClose),
    success: (title, message, autoClose) => showAlert('success', title, message, autoClose),
    warning: (title, message, autoClose) => showAlert('warning', title, message, autoClose),
    info: (title, message, autoClose) => showAlert('info', title, message, autoClose),
  };
};
