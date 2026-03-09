// src/components/ModalActivar2FA.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck } from "lucide-react";
import { useAlert } from "../context/AlerContext";

import AuthService from "../services/authService";
import "../styles/Modal2FA.css";

const ModalActivate2FA = ({ onClose }) => {
  const { error, success } = useAlert();
  
  const [qr, setQR] = useState("https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PruebaSultanYair_2FA");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current === false) {
      LoadData();
      hasFetched.current = true; 
    }
  }, []);

  const LoadData = async () => {
    try {
      setLoading(true);
      const dataAutentication = await AuthService.activarDosPasos();
      const { codigoQR, mensaje } = dataAutentication;
      setQR(codigoQR);
      setMessage(mensaje);
    } catch (err) {
      error("Error", "No se pudo generar el código adecuadamente");
    } finally {
      setLoading(false);
    }
  };

  const confirm2FA = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      const confirmation = await AuthService.confirmarDosPasos(code);
      success("Éxito", confirmation.mensaje || "Seguridad de 2 pasos activada");
      onClose(); 
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || "Código incorrecto";
      error("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="m2fa-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="m2fa-title"
    >
      <section className="m2fa-content">
        <header className="m2fa-header-blue">
          <div className="m2fa-icon-wrapper-white">
            <ShieldCheck size={32} className="m2fa-icon-blue" />
          </div>
          <h2 id="m2fa-title" className="m2fa-title-white">
            Activar Seguridad 2FA
          </h2>
          <p className="m2fa-subtitle-white">
            {message || "Genera códigos seguros desde tu celular"}
          </p>

          <button
            onClick={onClose}
            className="m2fa-btn-close-white"
            aria-label="Cerrar modal de seguridad"
          >
            <X size={22} />
          </button>
        </header>

        {loading ? (
          <div className="m2fa-loading-body">
            <div className="m2fa-spinner-blue"></div>
            <p>Procesando solicitud...</p>
          </div>
        ) : (
          <form onSubmit={confirm2FA} className="m2fa-form-body">
            <div className="m2fa-step-container">
              <p className="m2fa-step-label">1. Escanea este código QR</p>
              <p className="m2fa-step-desc">
                Abre Google Authenticator o Authy en tu celular y escanea:
              </p>
              <div className="m2fa-qr-group">
                <img
                  src={qr}
                  alt="Código QR de activación de seguridad"
                  className="m2fa-qr-image"
                />
              </div>
            </div>

            <div className="m2fa-step-container">
              <label htmlFor="codigo-confirmacion" className="m2fa-input-label">
                2. Ingresa el código de 6 dígitos
              </label>
              <p className="m2fa-step-desc">
                Generado por tu aplicación autenticadora para confirmar:
              </p>
              <input
                id="codigo-confirmacion"
                className="m2fa-input-modern"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000 000"
                required
                autoComplete="off"
              />
            </div>

            <div className="m2fa-action-group">
              <button
                type="button"
                onClick={onClose}
                className="m2fa-btn-secondary-modern"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="m2fa-btn-primary-modern"
                disabled={code.length < 6}
              >
                Confirmar y Activar
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default ModalActivate2FA;