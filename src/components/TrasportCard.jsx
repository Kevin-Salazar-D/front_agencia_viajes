import React from 'react';
import { Link } from 'react-router-dom';
//iconos
import icons from "../constants/icons";

// Importamos su propio CSS
import '../styles/TrasportCard.css';

const TransportCard = ({ transport }) => {

  // Ternario directo y sin escalas (más limpio)
  const getImageByType = (type) => {
    return type?.toLowerCase() === "avion" 
      ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80' 
      : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
  };

  return (
    <article className="transport-ui-card">
      <div className="transport-ui-card-image">
        <img src={getImageByType(transport.tipo)} alt={transport.nombre} loading="lazy" />
        <span className={`transport-ui-badge ${transport.tipo?.toLowerCase()}`}>
          {transport.tipo?.toLowerCase() === 'avion' ? icons.planeButton : icons.bus}
          {transport.tipo}
        </span>
      </div>

      <div className="transport-ui-card-content">
        <div className="transport-ui-card-header">
          <h3>{transport.nombre}</h3>
          <span className="transport-ui-model">{transport.modelo}</span>
        </div>

        <div className="transport-ui-stats">
          <div className="transport-ui-stat transport-ui-stat-icon">
            {icons.users}
            <span>Capacidad: <strong>{transport.capacidad}</strong></span>
          </div>
          <div className="transport-ui-stat transport-ui-stat-icon green">
            {icons.dollar}
            <span>Desde <strong>${transport.precio || 'Consultar'}</strong></span>
          </div>
        </div>

       
        <Link 
          to={`/transportes/${transport.id}`}
          className="transport-ui-btn-details"
          style={{ textDecoration: 'none' }}
        >
          Ver Detalles {icons.arrow}
        </Link>
      </div>
    </article>
  );
};

export default TransportCard;