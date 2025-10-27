import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Star, ArrowRight, Phone, Mail, Facebook, Instagram, Twitter, Menu, X } from 'lucide-react';
import './App.css';

// ========== NAVBAR ==========
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-content">
          <div className="logo">
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
            <button className="btn-text">Iniciar sesión</button>
            <button className="btn-primary">Registrarse</button>
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
            <button className="btn-text">Iniciar sesión</button>
            <button className="btn-primary">Registrarse</button>
          </div>
        )}
      </nav>
    </header>
  );
};

// ========== SEARCH BAR ==========
const SearchBar = ({ cities, onSearch }) => {
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
            disabled={isSearching}
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

// ========== PACKAGE CARD ==========
const PackageCard = ({ pkg }) => {
  return (
    <div className="package-card">
      <div className="package-image">
        <img src={pkg.image} alt={pkg.destination} />
        <div className="package-badge">{pkg.badge}</div>
        <div className="package-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-value">{pkg.rating}</span>
          <span className="rating-count">({pkg.reviews})</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{pkg.destination}</h3>
        <p className="package-hotel">{pkg.hotel}</p>
        
        <div className="package-details">
          <span>{pkg.nights} noches</span>
          <div className="package-price">
            <div className="price-label">Desde</div>
            <div className="price-value">${pkg.price.toLocaleString('es-MX')}</div>
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

// ========== APP PRINCIPAL ==========
function App() {
  const [cities, setCities] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    setCities([
      { id: 1, nombre: 'Cancún' },
      { id: 2, nombre: 'Ciudad de México' },
      { id: 3, nombre: 'Guadalajara' },
      { id: 4, nombre: 'Monterrey' },
      { id: 5, nombre: 'Puerto Vallarta' },
      { id: 6, nombre: 'Playa del Carmen' },
    ]);

    setPackages([
      {
        id: 1,
        destination: 'Cancún',
        hotel: 'Resort Paradise All Inclusive',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
        price: 8999,
        rating: 4.8,
        reviews: 234,
        nights: 4,
        badge: 'Más vendido'
      },
      {
        id: 2,
        destination: 'Puerto Vallarta',
        hotel: 'Ocean Breeze Hotel & Spa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        price: 6499,
        rating: 4.6,
        reviews: 189,
        nights: 3,
        badge: 'Oferta'
      },
      {
        id: 3,
        destination: 'Los Cabos',
        hotel: 'Luxury Sunset Resort',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        price: 12999,
        rating: 4.9,
        reviews: 456,
        nights: 5,
        badge: 'Premium'
      }
    ]);
  }, []);

  const handleSearch = (searchData) => {
    console.log('Búsqueda realizada:', searchData);
    alert(`Buscando paquetes de ciudad ${searchData.origin} a ciudad ${searchData.destination}`);
  };

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

          <SearchBar cities={cities} onSearch={handleSearch} />
        </div>
      </section>

      <section id="ofertas" className="packages-section">
        <div className="section-header">
          <div>
            <h2>Paquetes destacados</h2>
            <p>Las mejores ofertas de la semana</p>
          </div>
          <button className="btn-text-link">
            <span>Ver todos</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Destinos</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Viajeros felices</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">200+</div>
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

export default App;