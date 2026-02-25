import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Star, ArrowRight, Phone, Mail, Facebook, Instagram, Twitter, Menu, X, Loader, AlertCircle, CheckCircle, User, LogOut } from 'lucide-react';
import { getCities } from '../services/cities';
import { getHotels, getAllHotelDetails } from '../services/hotels';
import '../App.css';

// ========== ALERT COMPONENT ==========
const Alert = ({ type = 'info', title, message, onClose, autoClose = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={24} />;
      case 'success':
        return <CheckCircle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      default:
        return <AlertCircle size={24} />;
    }
  };

  const alertStyles = {
    error: { border: '#fecaca', bg: '#fef2f2', icon: '#dc2626', title: '#991b1b', text: '#7f1d1d' },
    success: { border: '#86efac', bg: '#f0fdf4', icon: '#10b981', title: '#065f46', text: '#047857' },
    warning: { border: '#fcd34d', bg: '#fffbeb', icon: '#f59e0b', title: '#92400e', text: '#b45309' },
    info: { border: '#bfdbfe', bg: '#eff6ff', icon: '#2563eb', title: '#1e40af', text: '#1d4ed8' }
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      maxWidth: '400px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ color: style.icon, flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: style.title }}>
          {title}
        </h4>}
        <p style={{ margin: 0, fontSize: '0.875rem', color: style.text }}>
          {message}
        </p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
};

// ========== MODAL ACTIVAR 2FA ==========
const ModalActivar2FA = ({ onClose }) => {
  const [qrCode, setQrCode] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3000/agenciaViajes/autenticacion';

  useEffect(() => {
    const obtenerQR = async () => {
      try {
        const response = await fetch(`${API_BASE}/activarDosPasos`, {
          method: 'POST',
          credentials: 'include', // 👈 ESTO ES CLAVE PARA COOKIES
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setQrCode(data.codigoQR || data.qr);
        } else {
          setMensaje(data.error || 'No se pudo generar el QR');
        }

      } catch (error) {
        console.error("Error al obtener QR:", error);
        setMensaje('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    obtenerQR();
  }, []);

  const confirmarCodigo = async () => {
    if (codigoIngresado.length < 6) {
      setMensaje('❌ El código debe tener 6 dígitos');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/confirmarDosPasos`, {
        method: 'POST',
        credentials: 'include', // 👈 IMPORTANTE
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: codigoIngresado })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('✅ ¡Seguridad 2FA activada con éxito!');

        // Actualizar usuario en localStorage SOLO visualmente (no token)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const updatedUser = { ...user, activacion_dos_pasos: 1 };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("storage"));
        }

        setTimeout(() => onClose(), 2000);

      } else {
        setMensaje('❌ ' + (data.error || 'Código incorrecto.'));
      }

    } catch (error) {
      setMensaje('❌ Error al verificar el código');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', maxWidth: '420px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <h2 style={{marginTop: 0, color: '#111827', fontSize: '1.5rem'}}>
          Configurar verificación
        </h2>

        {loading ? (
          <div style={{padding: '20px'}}>Cargando QR seguro...</div>
        ) : (
          <>
            <p style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: '20px'}}>
              Escanea el código con Google Authenticator para vincular tu cuenta
            </p>

            {qrCode ? (
              <img 
                src={qrCode} 
                alt="QR 2FA"
                style={{ 
                  margin: '0 auto 20px', 
                  display: 'block', 
                  width: '180px', 
                  height: '180px', 
                  border: '1px solid #eee', 
                  padding: '10px', 
                  borderRadius: '8px' 
                }} 
              />
            ) : (
              <div style={{color: '#ef4444', marginBottom: '20px'}}>
                No se pudo cargar la imagen del QR
              </div>
            )}

            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={codigoIngresado}
              onChange={(e) => setCodigoIngresado(e.target.value.replace(/\D/g, ''))}
              maxLength="6"
              style={{ 
                padding: '14px', 
                width: '100%', 
                marginBottom: '20px', 
                borderRadius: '8px', 
                border: '2px solid #d1d5db', 
                textAlign: 'center', 
                fontSize: '1.4rem', 
                fontWeight: 'bold', 
                letterSpacing: '5px' 
              }}
            />

            {mensaje && (
              <p style={{ 
                fontSize: '0.9rem', 
                marginBottom: '20px', 
                color: mensaje.includes('✅') ? '#059669' : '#dc2626',
                fontWeight: '600'
              }}>
                {mensaje}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={confirmarCodigo} className="btn-primary" style={{ flex: 2, padding: '12px' }}>
                Activar ahora
              </button>

              <button onClick={onClose} style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#4b5563' }}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ========== NAVBAR ==========
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false); // Estado para abrir/cerrar el QR
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); 
    window.dispatchEvent(new Event("storage")); 
  };

  // ✅ CORRECCIÓN: Ahora validamos el rol real de tu base de datos
  const isAdmin = user?.rol === 'admin'; 

  // Verificamos si ya tiene activado el 2FA para no mostrarle el botón de configuración si ya lo hizo
  const tiene2FA = user?.activacion_dos_pasos === 1 || user?.activacion_dos_pasos === true;

  return (
    <>
      {/* Si el estado es true, dibujamos el modal por encima de todo */}
      {show2FAModal && <ModalActivar2FA onClose={() => setShow2FAModal(false)} />}

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
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Inicio</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/hoteles'); }}>Destinos</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/paquetes'); }}>Paquetes</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/transportes'); }}>Transportes</a>
            </div>

            <div className="nav-actions">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#374151' }}>
                    <User size={18} color="#2563eb" /> Hola, {user.nombre}
                  </span>
                  
                  {/* Botón de 2FA: Solo se muestra si NO lo tiene activado aún */}
                  {!tiene2FA && (
                    <button 
                      onClick={() => setShow2FAModal(true)}
                      style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🔒 Proteger
                    </button>
                  )}
                  
                  {isAdmin && (
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate('/admin')}
                      style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      🔧 Admin
                    </button>
                  )}

                  <button 
                    className="btn-text" 
                    onClick={handleLogout}
                    style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <LogOut size={18} /> Salir
                  </button>
                </div>
              ) : (
                <>
                  <button className="btn-text" onClick={() => navigate('/login')}>Iniciar sesión</button>
                  <button className="btn-primary" onClick={() => navigate('/register')}>Registrarse</button>
                </>
              )}
            </div>

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* MENÚ MÓVIL (Versión condensada para no hacer el código gigante, aquí también agregué el botón 2FA) */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <a href="#" onClick={() => navigate('/')}>Inicio</a>
              <div style={{ borderTop: '1px solid #e5e7eb', margin: '10px 0' }}></div>
              {user ? (
                <>
                  <div style={{ padding: '10px 0', fontWeight: '600', color: '#2563eb' }}>Hola, {user.nombre}</div>
                  
                  {!tiene2FA && (
                    <button onClick={() => setShow2FAModal(true)} style={{ width: '100%', marginBottom: '10px', background: '#3b82f6', color: 'white', padding: '8px', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}>
                      🔒 Proteger Cuenta
                    </button>
                  )}

                  {isAdmin && (
                    <button className="btn-primary" onClick={() => navigate('/admin')} style={{ width: '100%', marginBottom: '10px', background: '#059669' }}>
                      🔧 Panel Admin
                    </button>
                  )}
                  <button className="btn-text" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', color: '#dc2626' }}>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button className="btn-text" onClick={() => navigate('/login')}>Iniciar sesión</button>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

// ========== SEARCH BAR ==========
const SearchBar = ({ cities, navigate, showAlert }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchData.origin) {
      showAlert('error', 'Campo incompleto', 'Por favor selecciona una ciudad de origen');
      return;
    }
    
    if (!searchData.destination) {
      showAlert('error', 'Campo incompleto', 'Por favor selecciona una ciudad de destino');
      return;
    }
    
    if (!searchData.startDate) {
      showAlert('error', 'Campo incompleto', 'Por favor selecciona una fecha de inicio');
      return;
    }
    
    if (!searchData.endDate) {
      showAlert('error', 'Campo incompleto', 'Por favor selecciona una fecha de finalización');
      return;
    }

    if (searchData.origin === searchData.destination) {
      showAlert('error', 'Destinos iguales', 'El origen y destino no pueden ser la misma ciudad');
      return;
    }

    if (new Date(searchData.startDate) >= new Date(searchData.endDate)) {
      showAlert('error', 'Fechas inválidas', 'La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setIsSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const originCity = cities.find(c => c.id === parseInt(searchData.origin));
      const destCity = cities.find(c => c.id === parseInt(searchData.destination));

      showAlert('success', '¡Búsqueda exitosa!', `Buscando viajes de ${originCity?.nombre} a ${destCity?.nombre}`);

      setTimeout(() => {
        navigate(`/resultados?from=${searchData.origin}&to=${searchData.destination}&start=${searchData.startDate}&end=${searchData.endDate}`);
      }, 500);

    } catch (err) {
      showAlert('error', 'Error en la búsqueda', 'Ocurrió un problema. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
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
              disabled={isSearching}
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
              disabled={isSearching}
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
              disabled={isSearching}
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
              disabled={isSearching}
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
const PackageCard = ({ hotel, hotelDetails, navigate }) => {
  // Usar datos reales del backend
  const rating = hotel.estrellas || 4.0;
  const reviews = hotelDetails?.total_resenas || 0;
  const precioNoche = hotelDetails?.precio_noche || 999;
  
  // Array de imágenes de respaldo
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"
  ];

  const imageUrl = hotel.imagen || hotelImages[hotel.id % hotelImages.length];

  const handleViewDetails = () => {
    navigate(`/hotel/${hotel.id}`);
  };

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

        <button className="btn-package" onClick={handleViewDetails}>
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
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelDetails, setHotelDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [citiesResponse, hotelsResponse, detailsResponse] = await Promise.all([
        getCities(),
        getHotels(),
        getAllHotelDetails().catch(() => ({ data: [] }))
      ]);

      console.log('📍 Ciudades cargadas:', citiesResponse.data);
      console.log('🏨 Hoteles cargados:', hotelsResponse.data);
      console.log('📋 Detalles cargados:', detailsResponse.data);

      setCities(citiesResponse.data || []);
      setHotels(hotelsResponse.data || []);

      // Crear un mapa de detalles por hotel_id
      const detailsMap = {};
      if (detailsResponse.data && Array.isArray(detailsResponse.data)) {
        detailsResponse.data.forEach(detail => {
          detailsMap[detail.hotel_id] = detail;
        });
      }
      setHotelDetails(detailsMap);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error al cargar los datos. Por favor intenta de nuevo.');
      
      setCities([
        { id: 1, nombre: 'Cancún' },
        { id: 2, nombre: 'Ciudad de México' },
        { id: 3, nombre: 'Guadalajara' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Filtrar hoteles por ciudad seleccionada
  const filteredHotels = selectedCity 
    ? hotels.filter(hotel => hotel.ciudad_id === parseInt(selectedCity))
    : hotels;

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
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))}

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

          <SearchBar cities={cities} navigate={navigate} showAlert={showAlert} />
        </div>
      </section>

      <section id="ofertas" className="packages-section">
        <div className="section-header">
          <div>
            <h2>Hoteles destacados</h2>
            <p>{filteredHotels.length > 0 ? `${filteredHotels.length} hoteles disponibles` : 'Cargando hoteles...'}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
            <button 
              className="btn-text-link"
              onClick={() => navigate('/paquetes')}
            >
              <span>Ver viajes</span>
              <ArrowRight size={20} />
            </button>
            <button 
              className="btn-text-link"
              onClick={() => navigate('/hoteles')}
            >
              <span>Ver todos</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="packages-grid">
          {filteredHotels.length > 0 ? (
            filteredHotels.slice(0, 6).map((hotel) => (
              <PackageCard 
                key={hotel.id} 
                hotel={hotel} 
                hotelDetails={hotelDetails[hotel.id]}
                navigate={navigate} 
              />
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              No hay hoteles disponibles para esta ciudad
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

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;