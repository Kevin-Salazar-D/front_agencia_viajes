import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ArrowLeft, Phone, Mail, Facebook, Instagram, Twitter, Menu, X, Loader, Filter, Package } from 'lucide-react';
import { getCities } from '../services/cities';
import { getAllPackages } from '../services/packages';
import '../App.css';

// ========== NAVBAR ==========
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const isAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><MapPin size={24} /></div>
            <span className="logo-text">ViajesFácil</span>
          </div>

          <div className="nav-links">
            <a href="/#inicio">Inicio</a>
            <a href="/#destinos">Destinos</a>
            <a href="/paquetes">Paquetes</a>
            <a href="/transportes">Transportes</a>
          </div>

          {/* ACCIONES DEL USUARIO */}
          <div className="nav-actions">
            {user ? (
              <>
                <span style={{ marginRight: '8px' }}>Hola, {user.nombre}</span>
                <button className="btn-primary" onClick={handleLogout}>
                  Cerrar sesión
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
              </>
            ) : (
              <>
                <button className="btn-text" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </button>
                <button className="btn-primary" onClick={() => navigate('/register')}>
                  Registrarse
                </button>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MENÚ MÓVIL */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/#inicio">Inicio</a>
            <a href="/#destinos">Destinos</a>
            <a href="/#ofertas">Ofertas</a>
            <a href="/#transportes">Transportes</a>

            {user ? (
              <>
                <span style={{ display: 'block', margin: '8px 0' }}>Hola, {user.nombre}</span>
                <button className="btn-primary" onClick={handleLogout}>
                  Cerrar sesión
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
              </>
            ) : (
              <>
                <button className="btn-text" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </button>
                <button className="btn-primary" onClick={() => navigate('/register')}>
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};


// ========== PACKAGE CARD ==========
const PackageCard = ({ packageData, navigate }) => {
  const rating = packageData.hotel_estrellas || 4.0;
  const precio = packageData.precio || 999;
  
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"
  ];

  const imageUrl = packageData.hotel_imagen || hotelImages[(packageData.hotel_id || 0) % hotelImages.length];

  // Calcular días de estadía
  const fechaInicio = new Date(packageData.fecha_inicio);
  const fechaFin = new Date(packageData.fecha_fin);
  const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

  return (
    <div className="package-card">
      <div className="package-image">
        <img src={imageUrl} alt={packageData.hotel_nombre || 'Hotel'} />
        <div className="package-badge" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          {packageData.tipo_paquete}
        </div>
        <div className="package-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-value">{rating}</span>
        </div>
      </div>

      <div className="package-content">
        <h3>{packageData.hotel_nombre || 'Hotel Incluido'}</h3>
        <p className="package-hotel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} />
          {packageData.ciudad}
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
            <strong>{packageData.transporte}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280' }}>📅 Duración:</span>
            <strong>{packageData.tiempo_estadia || dias} {(packageData.tiempo_estadia || dias) === 1 ? 'día' : 'días'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>🏨 Hotel:</span>
            <strong>{packageData.hotel_estrellas}★</strong>
          </div>
        </div>
        
        <div className="package-details">
          <span>Paquete completo</span>
          <div className="package-price">
            <div className="price-label">Precio total</div>
            <div className="price-value">${precio.toLocaleString('es-MX')}</div>
          </div>
        </div>

        <button className="btn-package" onClick={() => navigate(`/paquete/${packageData.paquete_id}`)}>
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
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [citiesResponse, packagesResponse] = await Promise.all([
        getCities(),
        getAllPackages()
      ]);

      console.log('📍 Ciudades:', citiesResponse.data);
      console.log('📦 Paquetes:', packagesResponse.data);

      setCities(citiesResponse.data || []);
      setPackages(packagesResponse.data || []);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar paquetes
  const getFilteredPackages = () => {
    let filtered = packages;

    if (selectedCity) {
      filtered = filtered.filter(pkg => 
        pkg.ciudad_id === parseInt(selectedCity)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(pkg => 
        pkg.tipo_paquete === selectedType
      );
    }

    return filtered;
  };

  const filteredPackages = getFilteredPackages();
  
  // Obtener tipos únicos de paquetes
  const packageTypes = [...new Set(packages.map(p => p.tipo_paquete))].filter(Boolean);

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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
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
            <option value="">Todos los tipos</option>
            {packageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
              {filteredPackages.map((pkg) => (
                <PackageCard 
                  key={pkg.paquete_id}
                  packageData={pkg}
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
