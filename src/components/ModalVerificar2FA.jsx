import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const ModalVerificar2FA = ({ userId, onSuccess, onCancel }) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerificar = async (e) => {
    e.preventDefault();
    if (codigo.length < 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await authService.verificarAuth2FA(userId, codigo);

      if (data.token) localStorage.setItem('token', data.token);
      if (data.usuario) localStorage.setItem('user', JSON.stringify(data.usuario));
      window.dispatchEvent(new Event("storage"));

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Código incorrecto, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '420px',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          padding: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '64px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            backdropFilter: 'blur(4px)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
            Verificación de Seguridad
          </h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
            Ingresa el código de 6 dígitos de tu aplicación
          </p>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: '2rem' }}>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              padding: '12px', borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerificar}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', fontSize: '0.9rem',
                fontWeight: 500, color: '#1f2937', marginBottom: '0.5rem'
              }}>
                Código de verificación
              </label>
              <input
                type="text"
                maxLength="6"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                style={{
                  width: '100%', padding: '14px',
                  fontSize: '1.8rem', textAlign: 'center',
                  letterSpacing: '12px', fontWeight: 'bold',
                  border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px', outline: 'none',
                  boxSizing: 'border-box', color: '#1f2937'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={loading || codigo.length < 6}
              style={{
                width: '100%', padding: '14px',
                background: loading || codigo.length < 6 ? '#93c5fd' : '#2563eb',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '1rem', fontWeight: 600,
                cursor: loading || codigo.length < 6 ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    display: 'inline-block'
                  }} />
                  Verificando...
                </>
              ) : 'Verificar identidad'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%', padding: '12px',
                background: '#f3f4f6', color: '#4b5563',
                border: 'none', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer'
              }}
            >
              Volver al login
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ModalVerificar2FA;