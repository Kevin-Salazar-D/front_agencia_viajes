import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import '../styles/HotelCard.css';

const HotelCard = ({ hotel, hotelDetails }) => {
  const rating = hotel.estrellas || 4.0;
  const reviews = hotelDetails?.total_resenas || 0;
  const precioNoche = hotelDetails?.precio_noche || 999;
  
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"
  ];

  const imageUrl = hotel.imagen || hotelImages[hotel.id % hotelImages.length];

  return (
    <article className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={`Fotografía de ${hotel.nombre}`} loading="lazy" />
        
        {/* Badge Disponible con Degradado */}
        <div className="package-badge">Disponible</div>
        
        {/* Rating limpio en la esquina */}
        <div className="package-rating">
          <Star className="star-icon" size={14} />
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
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
};

export default HotelCard;