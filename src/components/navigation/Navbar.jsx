import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, LogOut, Menu, X, ShieldCheck, Settings } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

//importal Modal
import Modal2FA from "@/components/modal/ModalActivate2FA";

// Importar estilos
import '@/styles/NavBar.css';


const Navbar = () => {
  const { userAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const navigate = useNavigate();

  const isAdmin = userAuth?.rol === "admin";
  const tiene2FA = userAuth?.activacion_dos_pasos === 1 || userAuth?.activacion_dos_pasos === true;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  //funcion para agarrar la url de las paginas
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  

  return (
    <>
      {show2FAModal && <Modal2FA onClose={() => setShow2FAModal(false)} />}

      <header className="navbar">
        <nav className="nav-container">
          <div className="nav-content">
            
            {/* LOGO */}
            <div className="logo" onClick={() => handleNavigation("/")}>
              <div className="logo-icon">
                <MapPin size={24} />
              </div>
              <span className="logo-text">ViajesFácil</span>
            </div>

            {/* LINKS DE NAVEGACIÓN (Desktop) */}
            <div className="nav-links">
              <button className="nav-link-btn" onClick={() => handleNavigation("/")}>Inicio</button>
              <button className="nav-link-btn" onClick={() => handleNavigation("/destinos")}>Destinos</button>
              <button className="nav-link-btn" onClick={() => handleNavigation("/paquetes")}>Paquetes</button>
              <button className="nav-link-btn" onClick={() => handleNavigation("/transportes")}>Transportes</button>
            </div>

            
            <div className="nav-actions">
              {userAuth ? (
                <div className="user-logged-info">
                  <div className="user-badge">
                    <User size={18} />
                    <span className="user-name">{userAuth.nombre}</span>
                  </div>

                  {!tiene2FA && (
                    <button className="btn-protect" onClick={() => setShow2FAModal(true)}>
                      <ShieldCheck size={18} /> Proteger
                    </button>
                  )}

                  {isAdmin && (
                    <button className="btn-admin" onClick={() => handleNavigation("/admin")}>
                      <Settings size={18} /> Panel Admin
                    </button>
                  )}

                  <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="btn-login" onClick={() => handleNavigation("/login")}>
                    Iniciar sesión
                  </button>
                  <button className="btn-register" onClick={() => handleNavigation("/crear-cuenta")}>
                    Registrarse
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN MENÚ MÓVIL */}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* MENÚ MÓVIL DESPLEGABLE */}
          <div className={`mobile-menu-container ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu">
              <button onClick={() => handleNavigation("/")}>Inicio</button>
              <button onClick={() => handleNavigation("/destinos")}>Destinos</button>
              <button onClick={() => handleNavigation("/paquetes")}>Paquetes</button>
              <button onClick={() => handleNavigation("/transportes")}>Transportes</button>
              
              <div className="mobile-divider"></div>
              
              {userAuth ? (
                <div className="mobile-user-section">
                  <p className="mobile-user-greeting">Hola, <strong>{userAuth.nombre}</strong></p>
                  
                  {!tiene2FA && (
                    <button className="mobile-btn-action protect" onClick={() => setShow2FAModal(true)}>
                      <ShieldCheck size={20} /> Proteger Cuenta
                    </button>
                  )}
                  
                  {isAdmin && (
                    <button className="mobile-btn-action admin" onClick={() => handleNavigation("/admin")}>
                      <Settings size={20} /> Panel de Administración
                    </button>
                  )}
                  
                  <button className="mobile-btn-action logout" onClick={handleLogout}>
                    <LogOut size={20} /> Crerar Sesión
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-section">
                  <button className="mobile-btn-login" onClick={() => handleNavigation("/login")}>
                    Iniciar sesión
                  </button>
                  <button className="mobile-btn-register" onClick={() => handleNavigation("/crear-cuenta")}>
                    Registrarse gratis
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;