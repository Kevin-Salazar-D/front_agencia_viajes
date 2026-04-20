import React, { useState } from "react";
import icons from "@/constants/icons";

//modal para activar 2FA
import ModalActivate2FA from "@/components/modal/ModalActivate2FA"; 

//context
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalConfirmContext";

//CSS
import "@/styles/SecurityTab.css"; 

const SecurityTab = () => {
  const { userAuth } = useAuth();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false); 
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  
  const { showModal } = useModal();

  const handleActivateModal = async () => {
    const isConfirm = await showModal({
      type: "warning",
      title: "¿Actualizar la Verificación 2FA?",
      message: "Una vez activada, cada vez que inicies sesión se te pedirá tu código de autenticación.",
      confirmText: "Sí, confirmar",
      cancelText: "Cancelar"
    });

    if (!isConfirm) return;

  
    setShow2FAModal(true);
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("Las contraseñas no coinciden");
    setShowPassModal(true);
  };

  const confirmPasswordChange = () => {
    console.log("Cambiando contraseña...");
    setShowPassModal(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="sec-bento-container">
      
      <div className="sec-bento-card sec-header-card">
        <h2>Seguridad de tu cuenta</h2>
        <p>Protege tu cuenta y gestiona tus datos.</p>
      </div>

      <div className="sec-bento-card">
        
        {/* --- SECCIÓN 2FA --- */}
        <div className="sec-section">
          <h4 className="sec-section-title">
            {icons.Bigprotected} AUTENTICACIÓN DE DOS PASOS (2FA)
          </h4>
          
          <div className="sec-2fa-row">
            <div className="sec-2fa-info">
              <div className="sec-icon-box">
               {icons.Bsmartphone}
              </div>
              <div className="sec-text-box">
                <strong>Aplicación de Autenticación</strong>
                <p>Protege tu cuenta con una capa adicional de seguridad utilizando una aplicación como Google Authenticator.</p>
              </div>
            </div>
            
            <button 
              type="button" 
              className={`sec-btn ${userAuth?.activacion_dos_pasos === 1 ? 'sec-btn-active' : 'sec-btn-primary'}`}
              onClick={handleActivateModal}
            >
              {userAuth?.activacion_dos_pasos === 1 ? "Configurar 2FA" : "Activar ahora"}
            </button>
          </div>
        </div>

        <hr className="sec-divider" />

        {/* --- SECCIÓN CONTRASEÑA --- */}
        <div className="sec-section">
          <h4 className="sec-section-title">
            {icons.Bpassword} ACTUALIZAR CONTRASEÑA
          </h4>
          
          <form className="sec-form" onSubmit={handlePasswordSubmit}>
            <div className="sec-form-grid">
              
              <div className="sec-input-group">
                <label>Contraseña Actual</label>
                <div className="sec-input-wrapper">
                  <span className="sec-input-icon">{icons.password}</span>
                  <input 
                    type="password" 
                    required 
                    value={passwords.current} 
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div className="sec-input-group">
                <label>Nueva Contraseña</label>
                <div className="sec-input-wrapper">
                  <span className="sec-input-icon">{icons.password}</span>
                  <input 
                    type="password" 
                    required 
                    value={passwords.new} 
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                    placeholder="Mínimo 8 caracteres" 
                  />
                </div>
              </div>

              <div className="sec-input-group">
                <label>Confirmar Nueva Contraseña</label>
                <div className="sec-input-wrapper">
                  <span className="sec-input-icon">{icons.password}</span>
                  <input 
                    type="password" 
                    required 
                    value={passwords.confirm} 
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                    placeholder="Repite tu nueva contraseña" 
                  />
                </div>
              </div>

            </div>

            <div className="sec-form-actions">
              <button type="submit" className="sec-btn sec-btn-primary">
                Actualizar credenciales
              </button>
            </div>
          </form>
        </div>

      </div>

      {show2FAModal && <ModalActivate2FA onClose={() => setShow2FAModal(false)} />}
    </div>
  );
};

export default SecurityTab;