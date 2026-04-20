import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

//importar iconos
import icons from "@/constants/icons";
// Importar estilos
import "@/styles/NavBar.css";

const Navbar = () => {
  const { userAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = userAuth?.rol === "admin";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <nav className="nav-container">
          <div className="nav-content">
            {/* LOGO */}
            <div className="logo" onClick={() => handleNavigation("/")}>
              <div className="logo-icon">{icons.location}</div>
              <span className="logo-text">ViajesFácil</span>
            </div>

            {/* LINKS DE NAVEGACIÓN (Desktop) */}
            <div className="nav-links">
              <button
                className="nav-link-btn"
                onClick={() => handleNavigation("/")}
              >
                Inicio
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNavigation("/destinos")}
              >
                Destinos
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNavigation("/paquetes")}
              >
                Paquetes
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNavigation("/transportes")}
              >
                Transportes
              </button>
            </div>

            <div className="nav-actions">
              {userAuth ? (
                <div className="user-logged-info">
                  <div className="user-badge">
                    {icons.userMedium}
                    <span className="user-name">{userAuth.nombre}</span>
                  </div>
                  <button
                    className="btn-user"
                    onClick={() => handleNavigation("/perfil/inicio")}
                  >
                    {icons.settingsMedium} Configuracion
                  </button>

                  {isAdmin && (
                    <button
                      className="btn-admin"
                      onClick={() => handleNavigation("/admin")}
                    >
                      {icons.settingsMedium} Panel Admin
                    </button>
                  )}

                  <button
                    className="btn-logout"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                  >
                   
                    {icons.logoutMedium}
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button
                    className="btn-login"
                    onClick={() => handleNavigation("/login")}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className="btn-register"
                    onClick={() => handleNavigation("/crear-cuenta")}
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN MENÚ MÓVIL */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? icons.close : icons.menu}
            </button>
          </div>

          {/* MENÚ MÓVIL DESPLEGABLE */}
          <div
            className={`mobile-menu-container ${mobileMenuOpen ? "open" : ""}`}
          >
            <div className="mobile-menu">
              <button onClick={() => handleNavigation("/")}>Inicio</button>
              <button onClick={() => handleNavigation("/destinos")}>
                Destinos
              </button>
              <button onClick={() => handleNavigation("/paquetes")}>
                Paquetes
              </button>
              <button onClick={() => handleNavigation("/transportes")}>
                Transportes
              </button>

              <div className="mobile-divider"></div>

              {userAuth ? (
                <div className="mobile-user-section">
                  <p className="mobile-user-greeting">
                    Hola, <strong>{userAuth.nombre}</strong>
                  </p>

               
                  <button
                    className="mobile-btn-action user-config"
                    onClick={() => handleNavigation("/perfil/inicio")}
                  >
                    {icons.settingsMedium} Configuración Usuario
                  </button>

                  {isAdmin && (
                    <button
                      className="mobile-btn-action admin"
                      onClick={() => handleNavigation("/admin")}
                    >
                      {icons.settingsMedium} Panel de Administración
                    </button>
                  )}

                  <button
                    className="mobile-btn-action logout"
                    onClick={handleLogout}
                  >
                    {icons.logoutMedium} Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-section">
                  <button
                    className="mobile-btn-login"
                    onClick={() => handleNavigation("/login")}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className="mobile-btn-register"
                    onClick={() => handleNavigation("/crear-cuenta")}
                  >
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