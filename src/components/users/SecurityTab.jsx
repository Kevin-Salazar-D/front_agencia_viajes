import React, { useState } from "react";
import icons from "@/constants/icons";
import ModalActivate2FA from "@/components/modal/ModalActivate2FA"; 
import ConfirmationModal from "@/components/modal/modalConfirmation"; 
import { ShieldCheck, Lock, Smartphone } from "lucide-react";
import "@/styles/SecurityTab.css";

const SecurityTab = () => {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("Las contraseñas no coinciden");
    setShowPassModal(true);
  };

  const confirmPasswordChange = () => {
    // Aquí tu llamada al backend
    console.log("Cambiando contraseña...");
    setShowPassModal(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="security-view-container">
      <div className="security-view-header">
        <h2 className="security-view-title">Configuración de Seguridad</h2>
        <p className="security-view-subtitle">Protege tu cuenta y gestiona tus credenciales de acceso.</p>
      </div>

      <div className="security-view-grid">
        {/* TARJETA 2FA */}
        <section className="security-view-card modal-border-navigation">
          <div className="security-card-content">
            <div className="security-card-icon icon-navigation">
              <Smartphone size={24} />
            </div>
            <div className="security-card-text">
              <h3>Autenticación de dos pasos (2FA)</h3>
              <p>Agrega una capa adicional de seguridad a tu cuenta utilizando una aplicación de autenticación.</p>
              <div className="security-status-tag">Recomendado</div>
            </div>
          </div>
          <div className="security-card-actions">
            <button className="btn-security-primary" onClick={() => setShow2FAModal(true)}>
              Configurar seguridad
            </button>
          </div>
        </section>

        {/* TARJETA PASSWORD */}
        <section className="security-view-card modal-border-info">
          <div className="security-card-content">
            <div className="security-card-icon icon-info">
              <Lock size={24} />
            </div>
            <div className="security-card-text">
              <h3>Cambiar Contraseña</h3>
              <p>Asegúrate de usar una contraseña robusta y única para mantener tu cuenta segura.</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="security-form-layout">
            <div className="security-input-group">
              <label>Contraseña actual</label>
              <input type="password" required value={passwords.current} 
                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                placeholder="••••••••" />
            </div>
            <div className="security-input-group">
              <label>Nueva contraseña</label>
              <input type="password" required value={passwords.new} 
                onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="security-input-group">
              <label>Confirmar contraseña</label>
              <input type="password" required value={passwords.confirm} 
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                placeholder="Repite tu nueva contraseña" />
            </div>
            <div className="security-form-actions">
              <button type="submit" className="btn-security-dark">
                Actualizar credenciales
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* MODALES */}
      {show2FAModal && <ModalActivate2FA onClose={() => setShow2FAModal(false)} />}

      {/* ✅ Renderizado condicional — mismo patrón que el modal de 2FA */}
      {showPassModal && (
        <ConfirmationModal 
          onClose={() => setShowPassModal(false)}
          onConfirm={confirmPasswordChange}
          title="¿Confirmar cambio?"
          message="Tu sesión se mantendrá activa, pero la contraseña cambiará inmediatamente."
        />
      )}
    </div>
  );
};

export default SecurityTab;