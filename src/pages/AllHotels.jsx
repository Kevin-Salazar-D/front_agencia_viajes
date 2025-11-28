import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ArrowLeft, Phone, Mail, Facebook, Instagram, Twitter, Menu, X, Loader, Filter } from 'lucide-react';
import { getCities } from '../services/cities';
import { getHotels, getAllHotelDetails } from '../services/hotels';
import '../App.css';

// ========== NAVBAR ==========
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isAdmin = true;

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <MapPin size={24} />
            </div>
            <span className="logo-text">ViajesFácil</span>
          </div>
          
          <div className="nav-links">
            <a href="/#inicio">Inicio</a>
            <a href="/#destinos">Destinos</a>
            <a href="/#ofertas">Ofertas</a>
            <a href="/#contacto">Contacto</a>
          </div>

          <div className="nav-actions">
            <button className="btn-text" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Registrarse
            </button>
            
            {isAdmin && (
              <button 
                className="btn-primary" 
                onClick={() => navigate('/admin')}
                style={{ 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  marginLeft: '8px'
                }}
              >
                🔧 Admin
              </button>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/#inicio">Inicio</a>
            <a href="/#destinos">Destinos</a>
            <a href="/#ofertas">Ofertas</a>
            <a href="/#contacto">Contacto</a>
            <button className="btn-text" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Registrarse
            </button>
            
            {isAdmin && (
              <button 
                className="btn-primary" 
                onClick={() => navigate('/admin')}
                style={{ 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  marginTop: '8px'
                }}
              >
                🔧 Admin
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

// ========== HOTEL CARD ==========
const HotelCard = ({ hotel, hotelDetails, navigate }) => {
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
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={hotel.nombre} />
        <div className="package-badge">Disponible</div>
        <div className="package-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({reviews} reseñas)</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{hotel.nombre}</h3>
        <p className="package-hotel">{hotel.direccion || 'Ubicación céntrica'}</p>
        
        <div className="package-details">
          <span>Por noche</span>
          <div className="package-price">
            <div className="price-label">Desde</div>
            <div className="price-value">${precioNoche.toLocaleString('es-MX')}</div>
          </div>
        </div>

        <button className="btn-package" onClick={() => navigate(`/hotel/${hotel.id}`)}>
          <span>Ver detalles</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ========== FOOTER ==========
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">
                <MapPin size={24} />
              </div>
              <span>ViajesFácil</span>
            </div>
            <p>Tu compañero perfecto para descubrir el mundo</p>
          </div>

          <div className="footer-column">
            <h3>Empresa</h3>
            <ul>
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Trabaja con nosotros</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Soporte</h3>
            <ul>
              <li><a href="#">Centro de ayuda</a></li>
              <li><a href="#">Términos y condiciones</a></li>
              <li><a href="#">Política de privacidad</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li className="contact-item">
                <Phone size={16} />
                <span>+52 33 1234 5678</span>
              </li>
              <li className="contact-item">
                <Mail size={16} />
                <span>info@viajesfacil.com</span>
              </li>
            </ul>
            <div className="social-links">
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Instagram size={24} /></a>
              <a href="#"><Twitter size={24} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 ViajesFácil. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// ========== ALL HOTELS COMPONENT ==========
function AllHotels() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelDetails, setHotelDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('nombre');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [citiesResponse, hotelsResponse, detailsResponse] = await Promise.all([
        getCities(),
        getHotels(),
        getAllHotelDetails().catch(() => ({ data: [] }))
      ]);

      setCities(citiesResponse.data || []);
      setHotels(hotelsResponse.data || []);

      const detailsMap = {};
      if (detailsResponse.data && Array.isArray(detailsResponse.data)) {
        detailsResponse.data.forEach(detail => {
          detailsMap[detail.hotel_id] = detail;
        });
      }
      setHotelDetails(detailsMap);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y ordenar hoteles
  const getFilteredAndSortedHotels = () => {
    let filtered = selectedCity 
      ? hotels.filter(hotel => hotel.ciudad_id === parseInt(selectedCity))
      : hotels;

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio_asc':
          const precioA = hotelDetails[a.id]?.precio_noche || 0;
          const precioB = hotelDetails[b.id]?.precio_noche || 0;
          return precioA - precioB;
        case 'precio_desc':
          const precioA2 = hotelDetails[a.id]?.precio_noche || 0;
          const precioB2 = hotelDetails[b.id]?.precio_noche || 0;
          return precioB2 - precioA2;
        case 'estrellas':
          return (b.estrellas || 0) - (a.estrellas || 0);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredHotels = getFilteredAndSortedHotels();

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Loader size={48} className="spinner" />
          <p>Cargando hoteles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      
      {/* Header Section */}
      <section style={{
        padding: '4rem 2rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </button>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Todos nuestros hoteles
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Descubre {hotels.length} hoteles increíbles en {cities.length} destinos
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section style={{ 
        padding: '2rem', 
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Filter size={20} color="#6b7280" />
          
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.95rem',
              minWidth: '200px'
            }}
          >
            <option value="">Todas las ciudades</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.nombre}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.95rem',
              minWidth: '200px'
            }}
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="estrellas">Mejor calificación</option>
          </select>

          <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.95rem' }}>
            Mostrando {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hoteles'}
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section style={{ padding: '3rem 2rem', minHeight: '50vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredHotels.length > 0 ? (
            <div className="packages-grid">
              {filteredHotels.map((hotel) => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  hotelDetails={hotelDetails[hotel.id]}
                  navigate={navigate} 
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No se encontraron hoteles
              </p>
              <p>Intenta cambiar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AllHotels;