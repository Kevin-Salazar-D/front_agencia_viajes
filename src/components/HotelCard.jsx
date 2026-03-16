import { Link } from 'react-router-dom';
import '../styles/HotelCard.css';
import icons from "../constants/icons";

const HotelCard = ({ hotel }) => {
  const rating = hotel.estrellas || 4.0;
  const reviews = hotel?.total_resenas || 0;
  const precioNoche = hotel?.precio_noche || 999;
  const imageUrl = hotel.imagen 

  return (
    <article className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={`Fotografía de ${hotel.nombre}`} loading="lazy" />
        
        {/* Badge Disponible con Degradado */}
        <div className="package-badge">Disponible</div>
        
        {/* Rating limpio en la esquina */}
        <div className="package-rating">
          {icons.star}
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({reviews} reseñas)</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{hotel.nombre}</h3>
        <p className="package-hotel">{hotel.direccion || 'Ubicación céntrica'}</p>
        
        {/* ====== NUEVA SECCIÓN DE PRECIO ====== */}
        <div className="package-details">
          <div className="price-text-left">
            <span className="price-label">Precio</span>
            <span className="price-sub">Por noche</span>
          </div>
          <div className="price-value">
            ${precioNoche.toLocaleString('es-MX')}
          </div>
        </div>

      
        <Link to={`/hotel/${hotel.id}`} className="btn-package">
          <span>Ver detalles</span>
          {icons.arrow}
        </Link>
      </div>
    </article>
  );
};

export default HotelCard;