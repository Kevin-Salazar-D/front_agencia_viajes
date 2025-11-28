import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ArrowLeft, Phone, Mail, Facebook, Instagram, Twitter, Menu, X, Loader, Filter, Package } from 'lucide-react';
import { getCities } from '../services/cities';
import { getAllJourneys } from '../services/journeys';
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
            <a href="/hoteles">Destinos</a>
            <a href="/paquetes">Paquetes</a>
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
            <a href="/hoteles">Destinos</a>
            <a href="/paquetes">Paquetes</a>
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

// ========== PACKAGE CARD ==========
const PackageCard = ({ journey, hotel, hotelDetails, navigate }) => {
  const rating = hotel?.estrellas || 4.0;
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

  const imageUrl = hotel?.imagen || hotelImages[(hotel?.id || 0) % hotelImages.length];

  // Calcular días de estadía
  const fechaSalida = new Date(journey.fecha_salida);
  const fechaLlegada = new Date(journey.fecha_llegada);
  const dias = Math.ceil((fechaLlegada - fechaSalida) / (1000 * 60 * 60 * 24));

  // Calcular precio total del paquete (transporte + hotel)
  const precioTotal = precioNoche * dias + 500; // +500 por el transporte (estimado)

  return (
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={hotel?.nombre || 'Hotel'} />
        <div className="package-badge" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Paquete Completo
        </div>
        <div className="package-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({reviews} reseñas)</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{hotel?.nombre || 'Hotel Incluido'}</h3>
        <p className="package-hotel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} />
          {journey.ciudad_origen} → {journey.ciudad_destino}
        </p>
        
        <div style={{ 
          margin: '1rem 0',
          padding: '0.75rem',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280' }}>🚌 Transporte:</span>
            <strong>{journey.transporte}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280' }}>📅 Duración:</span>
            <strong>{dias} {dias === 1 ? 'día' : 'días'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>🏨 Hotel:</span>
            <strong>Incluido</strong>
          </div>
        </div>
        
        <div className="package-details">
          <span>Paquete completo</span>
          <div className="package-price">
            <div className="price-label">Desde</div>
            <div className="price-value">${precioTotal.toLocaleString('es-MX')}</div>
          </div>
        </div>

        <button className="btn-package" onClick={() => navigate(`/paquete/${journey.viaje_id}`)}>
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

// ========== PACKAGES COMPONENT ==========
function Packages() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelDetails, setHotelDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [citiesResponse, journeysResponse, hotelsResponse, detailsResponse] = await Promise.all([
        getCities(),
        getAllJourneys(),
        getHotels(),
        getAllHotelDetails().catch(() => ({ data: [] }))
      ]);

      console.log('📍 Ciudades:', citiesResponse.data);
      console.log('✈️ Viajes:', journeysResponse.data);
      console.log('🏨 Hoteles:', hotelsResponse.data);

      setCities(citiesResponse.data || []);
      setJourneys(journeysResponse.data || []);
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

  // Crear paquetes combinando viajes con hoteles
  const createPackages = () => {
    return journeys.map(journey => {
      // Buscar hoteles en la ciudad de destino
      const destinationHotels = hotels.filter(h => h.ciudad_id === journey.destino_ciudad_id);
      const hotel = destinationHotels[0]; // Tomar el primer hotel disponible
      
      return {
        journey,
        hotel,
        hotelDetails: hotel ? hotelDetails[hotel.id] : null
      };
    }).filter(pkg => pkg.hotel); // Solo mostrar paquetes que tengan hotel
  };

  // Filtrar paquetes
  const getFilteredPackages = () => {
    let packages = createPackages();

    if (selectedOrigin) {
      packages = packages.filter(pkg => 
        pkg.journey.origen_ciudad_id === parseInt(selectedOrigin)
      );
    }

    if (selectedDestination) {
      packages = packages.filter(pkg => 
        pkg.journey.destino_ciudad_id === parseInt(selectedDestination)
      );
    }

    return packages;
  };

  const filteredPackages = getFilteredPackages();

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
          <p>Cargando paquetes...</p>
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
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Package size={36} />
            <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '700' }}>
              Paquetes completos
            </h1>
          </div>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Viajes todo incluido: transporte + hotel en un solo paquete
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
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
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
            <option value="">Ciudad de origen</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.nombre}</option>
            ))}
          </select>

          <select 
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
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
            <option value="">Ciudad de destino</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.nombre}</option>
            ))}
          </select>

          <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.95rem' }}>
            {filteredPackages.length} {filteredPackages.length === 1 ? 'paquete' : 'paquetes'} disponibles
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section style={{ padding: '3rem 2rem', minHeight: '50vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredPackages.length > 0 ? (
            <div className="packages-grid">
              {filteredPackages.map((pkg, index) => (
                <PackageCard 
                  key={`${pkg.journey.viaje_id}-${index}`}
                  journey={pkg.journey}
                  hotel={pkg.hotel}
                  hotelDetails={pkg.hotelDetails}
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
              <Package size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No se encontraron paquetes
              </p>
              <p>Intenta cambiar los filtros de búsqueda o crea nuevos viajes en el panel de administración</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Packages;
