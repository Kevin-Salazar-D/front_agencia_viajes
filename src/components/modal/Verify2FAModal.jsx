import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

import { useAlert } from '@/context/AlerContext';
import { useAuth } from "@/context/AuthContext"; 
import authService from '@/services/authService';

import '@/styles/Modal2FA.css'; 

const Verify2FAModal = ({ userId, onSuccess, onCancel }) => {
  const [codigo, setCodigo] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { error, success } = useAlert();
  const { login } = useAuth(); // CORRECCIÓN: Ahora sí extraemos 'login' del AuthContext

  const handleVerificar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorApi("");

    try {
      const response = await authService.verificarAuth2FA(userId, codigo);
      const { usuario, mensaje } = response;
      
      success("Felicitaciones.", mensaje);
      
      // Actualizamos el estado global al instante
      login(usuario); 
      onSuccess();

    } catch (err) {
      setErrorApi(err.response?.data?.error || "Código incorrecto, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m2fa-overlay" role="dialog" aria-modal="true" aria-labelledby="m2fa-title">
      <section className="m2fa-content">

        <header className="m2fa-header-blue">
          <div className="m2fa-icon-wrapper-white">
            <ShieldCheck size={32} className="m2fa-icon-blue" />
          </div>
          <h2 id="m2fa-title" className="m2fa-title-white">
            Verificación de Seguridad
          </h2>
          <p className="m2fa-subtitle-white">
            Ingresa el código de 6 dígitos de tu aplicación
          </p>
        </header>

        <form onSubmit={handleVerificar} className="m2fa-form-body">

          {errorApi && (
            <div className="m2fa-error-alert">
              <AlertCircle size={18} />
              <span>{errorApi}</span>
            </div>
          )}

          <div className="m2fa-step-container" style={{ marginBottom: '2rem' }}>
            <label htmlFor="codigo-verificacion" className="m2fa-input-label">
              Código de verificación
            </label>
            <input
              id="codigo-verificacion"
              className="m2fa-input-modern"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="6"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.replace(/\D/g, ''));
                if (errorApi) setErrorApi(""); 
              }}
              placeholder="000 000"
              autoFocus
              required
              autoComplete="off"
            />
          </div>

          <div className="m2fa-action-column">
            <button
              type="submit"
              className="m2fa-btn-primary-modern"
              disabled={loading || codigo.length < 6}
            >
              {loading ? (
                <>
                  <span className="m2fa-btn-spinner"></span>
                  Verificando...
                </>
              ) : (
                "Verificar identidad"
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="m2fa-btn-secondary-modern"
            >
              Volver al login
            </button>
          </div>

        </form>
      </section>
    </div>
  );
};

export default Verify2FAModal;