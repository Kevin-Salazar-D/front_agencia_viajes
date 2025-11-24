import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, X } from 'lucide-react';
import '../styles/Alert.css';

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
      case 'error':
        return <AlertCircle size={24} />;
      case 'success':
        return <CheckCircle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      default:
        return <InfoIcon size={24} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">
        {getIcon()}
      </div>
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

// Contenedor para mostrar múltiples alertas
export const AlertContainer = ({ alerts, removeAlert }) => {
  return (
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
    </div>
  );
};

// Hook para manejar alertas
export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, title, message, autoClose = 4000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message, autoClose }]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const error = (title, message) => showAlert('error', title, message);
  const success = (title, message) => showAlert('success', title, message);
  const warning = (title, message) => showAlert('warning', title, message);
  const info = (title, message) => showAlert('info', title, message);

  return {
    alerts,
    removeAlert,
    showAlert,
    error,
    success,
    warning,
    info
  };
};