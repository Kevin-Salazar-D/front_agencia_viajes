import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const ModalActivar2FA = ({ onClose }) => {
  const [qr, setQr] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamamos a activarDosPasos para obtener el QR generado por el back
    authService.activarDosPasos()
      .then(data => {
        setQr(data.qr); // El back envía { qr: "data:image/png..." }
        setLoading(false);
      })
      .catch(() => alert("Error al generar QR"));
  }, []);

  const handleConfirmar = async () => {
    try {
      await authService.confirmarDosPasos(codigo);
      alert("¡Autenticación de dos pasos activada!");
      onClose();
    } catch (err) {
      alert("Código incorrecto. Intenta de nuevo.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Activar Seguridad 2FA</h3>
        {loading ? <p>Generando código seguro...</p> : (
          <>
            <p>1. Escanea este QR con Google Authenticator o Authy:</p>
            <div className="qr-container">
               <img src={qr} alt="QR de activación" style={{ width: '200px' }} />
            </div>
            <p>2. Ingresa el código de 6 dígitos para confirmar:</p>
            <input 
              className="input-codigo"
              type="text" 
              maxLength="6" 
              value={codigo} 
              onChange={(e) => setCodigo(e.target.value)} 
              placeholder="000000"
            />
            <button onClick={handleConfirmar} className="btn-primario">Activar</button>
            <button onClick={onClose} className="btn-link">Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalActivar2FA;