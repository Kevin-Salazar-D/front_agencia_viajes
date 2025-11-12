import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Star, ArrowRight, Phone, Mail, Facebook, Instagram, Twitter, Menu, X, Loader } from 'lucide-react';
import { getCities } from '../services/cities';
import { getHotels } from '../services/hotels';
import '../App.css';

// ========== NAVBAR ==========
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <a href="#inicio">Inicio</a>
            <a href="#destinos">Destinos</a>
            <a href="#ofertas">Ofertas</a>
            <a href="#contacto">Contacto</a>
          </div>

          <div className="nav-actions">
            <button className="btn-text" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Registrarse
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#inicio">Inicio</a>
            <a href="#destinos">Destinos</a>
            <a href="#ofertas">Ofertas</a>
            <a href="#contacto">Contacto</a>
            <button className="btn-text" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Registrarse
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

// ========== SEARCH BAR ==========
const SearchBar = ({ cities, onSearch, loading }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchData.origin || !searchData.destination || !searchData.startDate || !searchData.endDate) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearch(searchData);
    }, 1500);
  };

  return (
    <div className="search-bar">
      <div className="search-grid">
        <div className="search-field">
          <label>Origen</label>
          <div className="input-wrapper">
            <MapPin className="input-icon" size={20} />
            <select 
              value={searchData.origin}
              onChange={(e) => setSearchData({...searchData, origin: e.target.value})}
              disabled={loading}
            >
              <option value="">Seleccionar ciudad</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-field">
          <label>Destino</label>
          <div className="input-wrapper">
            <MapPin className="input-icon" size={20} />
            <select 
              value={searchData.destination}
              onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
              disabled={loading}
            >
              <option value="">Seleccionar ciudad</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-field">
          <label>Fecha inicio</label>
          <div className="input-wrapper">
            <Calendar className="input-icon" size={20} />
            <input 
              type="date"
              value={searchData.startDate}
              onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="search-field">
          <label>Fecha fin</label>
          <div className="input-wrapper">
            <Calendar className="input-icon" size={20} />
            <input 
              type="date"
              value={searchData.endDate}
              onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
              min={searchData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="search-field search-button-wrapper">
          <button 
            onClick={handleSearch}
            disabled={isSearching || loading}
            className="btn-search"
          >
            {isSearching ? (
              <span className="loading-content">
                <span className="spinner"></span>
                <span>Buscando...</span>
              </span>
            ) : (
              <>
                <Search size={20} />
                <span>Buscar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== PACKAGE CARD (HOTEL) ==========
const PackageCard = ({ hotel }) => {
  // Generar rating aleatorio entre 4.0 y 5.0
  const rating = hotel.calificacion || (4.0 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 500) + 50;
  
  // Imagen placeholder basada en el hotel
  const imageUrl = hotel.imagen || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`;

  return (
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={hotel.nombre} />
        <div className="package-badge">Disponible</div>
        <div className="package-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({reviews})</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{hotel.nombre}</h3>
        <p className="package-hotel">{hotel.direccion || 'Ubicación céntrica'}</p>
        
        <div className="package-details">
          <span>Desde 3 noches</span>
          <div className="package-price">
            <div className="price-label">Desde</div>
            <div className="price-value">${hotel.precio ? hotel.precio.toLocaleString('es-MX') : '5,999'}</div>
          </div>
        </div>

        <button className="btn-package">
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

// ========== HOME COMPONENT ==========
function Home() {
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar ciudades y hoteles en paralelo
      const [citiesResponse, hotelsResponse] = await Promise.all([
        getCities(),
        getHotels()
      ]);

      console.log('📍 Ciudades cargadas:', citiesResponse.data);
      console.log('🏨 Hoteles cargados:', hotelsResponse.data);

      setCities(citiesResponse.data || []);
      setHotels(hotelsResponse.data || []);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error al cargar los datos. Por favor intenta de nuevo.');
      
      // Datos de respaldo en caso de error
      setCities([
        { id: 1, nombre: 'Cancún' },
        { id: 2, nombre: 'Ciudad de México' },
        { id: 3, nombre: 'Guadalajara' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    console.log('🔍 Búsqueda realizada:', searchData);
    const originCity = cities.find(c => c.id === parseInt(searchData.origin));
    const destCity = cities.find(c => c.id === parseInt(searchData.destination));
    
    alert(`Buscando paquetes de ${originCity?.nombre} a ${destCity?.nombre}`);
  };

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
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      
      <section id="inicio" className="hero">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600" 
          alt="Viajes"
          className="hero-image"
        />
        
        <div className="hero-content">
          <h1 className="hero-title">
            Descubre tu próxima<br />
            <span className="gradient-text">aventura perfecta</span>
          </h1>
          <p className="hero-subtitle">
            Los mejores paquetes de viaje con hoteles y transporte incluido
          </p>

          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              color: '#c00'
            }}>
              {error}
            </div>
          )}

          <SearchBar cities={cities} onSearch={handleSearch} loading={loading} />
        </div>
      </section>

      <section id="ofertas" className="packages-section">
        <div className="section-header">
          <div>
            <h2>Hoteles destacados</h2>
            <p>{hotels.length > 0 ? `${hotels.length} hoteles disponibles` : 'Cargando hoteles...'}</p>
          </div>
          <button className="btn-text-link">
            <span>Ver todos</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="packages-grid">
          {hotels.length > 0 ? (
            hotels.slice(0, 6).map((hotel) => (
              <PackageCard key={hotel.id} hotel={hotel} />
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              No hay hoteles disponibles en este momento
            </p>
          )}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{cities.length}+</div>
              <div className="stat-label">Destinos</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Viajeros felices</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{hotels.length}+</div>
              <div className="stat-label">Hoteles aliados</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.8★</div>
              <div className="stat-label">Calificación</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;