import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/styles/Sidebar.css";
import icons from "@/constants/icons";
import Profile from "@/components/users/Profile";

const Sidebar = () => {
  const location = useLocation(); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";
  
  return (
    <aside className={`premium-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? icons.menu : icons.close}
        </button>
      </div>
      
      <Profile size={isCollapsed ? "70" : "100"} direction="column" showInfo={!isCollapsed}/>

      <nav className="sidebar-nav">
        {!isCollapsed && <p className="nav-subtitle">CUENTA</p>}
        
        <Link title={isCollapsed ? "Mi perfil" : ""} to="/perfil" className={isActive("/perfil")}>
          {icons.user} {!isCollapsed && "Mi perfil"}
        </Link>
        
        {/* Punto 1 y 2: Ruta de seguridad configurada */}
        <Link title={isCollapsed ? "Seguridad" : ""} to="/perfil/seguridad" className={isActive("/perfil/seguridad")}>
          {icons.protected} {!isCollapsed && "Seguridad"}
        </Link>

        {!isCollapsed && <p className="nav-subtitle mt-4">MIS VIAJES</p>}
        
        <Link title={isCollapsed ? "Reservaciones" : ""} to="/mis-reservaciones" className={isActive("/mis-reservaciones")}>
          {icons.calendarMedium} {!isCollapsed && "Reservaciones"}
        </Link>
        <Link title={isCollapsed ? "Mis vuelos" : ""} to="/mis-vuelos" className={isActive("/mis-vuelos")}>
          {icons.planeButton} {!isCollapsed && "Vuelos"}
        </Link>
        <Link title={isCollapsed ? "Hoteles" : ""} to="/mis-hoteles" className={isActive("/mis-hoteles")}>
          {icons.hotelMedium} {!isCollapsed && "Hoteles"}
        </Link>
        <Link title={isCollapsed ? "Lugares visitados" : ""} to="/lugares-visitados" className={isActive("/lugares-visitados")}>
          {icons.location} {!isCollapsed && "Lugares Visitados"}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;