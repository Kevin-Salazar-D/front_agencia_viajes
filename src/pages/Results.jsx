import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Loader, Star, Package, Hotel, 
  Calendar, Plane, Bus, Clock, Users, CheckCircle 
} from 'lucide-react';

import "../styles/Results.css"; 

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estado
  const [view, setView] = useState('hotels');
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Params URL (Ajusta esto si cambiaste a useParams como sugerí antes)
  const originId = searchParams.get('from');
  const destId = searchParams.get('to');
  const startDate = searchParams.get('start') || 'Seleccionar fecha';
  const endDate = searchParams.get('end') || 'Seleccionar fecha';

  const API_BASE = 'http://localhost:3000/agenciaViajes';

  const safeFetch = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la petición');
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      return []; 
    }
  };

  useEffect(() => {
    loadData();
  }, [destId]); 

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [citiesData, hotelsData, packagesData, transportsData] = await Promise.all([
        safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`),
        safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`), 
        safeFetch(`${API_BASE}/paquetes/mostrarTodosPaquetes`),
        safeFetch(`${API_BASE}/transportes/obtenerTodosTransportes`)
      ]);

      const citiesList = Array.isArray(citiesData) ? citiesData : [];
      setCities(citiesList);
      
      const allHotels = Array.isArray(hotelsData) ? hotelsData : [];
      let filteredHotels = destId 
        ? allHotels.filter(h => parseInt(h.ciudad_id) === parseInt(destId) || parseInt(h.id_ciudad) === parseInt(destId))
        : allHotels;
      setHotels(filteredHotels);

      let allPackages = Array.isArray(packagesData) ? packagesData : [];
      let filteredPackages = [];

      if (destId) {
        const destCity = citiesList.find(c => c.id === parseInt(destId));
        filteredPackages = allPackages.filter(pkg => {
          const cityIdMatch = pkg.ciudad_id && parseInt(pkg.ciudad_id) === parseInt(destId);
          const cityNameMatch = destCity && pkg.ciudad && pkg.ciudad.toLowerCase().trim() === destCity.nombre.toLowerCase().trim();
          return cityIdMatch || cityNameMatch;
        });
      } else {
        filteredPackages = allPackages;
      }
      setPackages(filteredPackages);

      const allTransports = Array.isArray(transportsData) ? transportsData : [];
      setTransports(allTransports);

      if (filteredHotels.length === 0) {
        if (filteredPackages.length > 0) setView('packages');
        else if (allTransports.length > 0) setView('transports');
      }

    } catch (err) {
      setError('Hubo un problema al cargar las opciones.');
    } finally {
      setLoading(false);
    }
  };

  const getCityName = (id) => {
    if (!id) return '...';
    const city = cities.find(c => c.id === parseInt(id));
    return city?.nombre || 'Destino Desconocido';
  };

  const calculateNights = () => {
    if (startDate === 'Seleccionar fecha' || endDate === 'Seleccionar fecha') return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getTransportIcon = (type) => {
    if (!type) return <Bus size={18} />;
    return type.toLowerCase().includes('avion') ? <Plane size={18} /> : <Bus size={18} />;
  };

  const getTransportImage = (type) => {
    if (type?.toLowerCase() === 'avion') return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80';
  };

  if (loading) {
    return (
      <div className="results-page loading-center">
        <Loader size={64} className="spinner" />
        <h2 style={{marginTop: '1.5rem', color: 'var(--text)'}}>Preparando tu viaje...</h2>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* HEADER MODERNO SIN BOTÓN VOLVER */}
      <header className="results-header">
        <div className="results-container">
          <div className="header-content">
            <div className="title-section">
              <p className="subtitle">
                <MapPin size={18} /> Resultados de búsqueda
              </p>
              <h1>Explora {getCityName(destId)}</h1>
            </div>
            
            <div className="trip-info">
              <div className="badge-date">
                <Calendar size={18} />
                {startDate} <span style={{color: '#cbd5e1'}}>→</span> {endDate}
              </div>
              <p className="subtitle" style={{justifyContent: 'flex-end', marginTop: '0.5rem', fontSize: '0.9rem'}}>
                Desde {getCityName(originId)} • {calculateNights()} noches
              </p>
            </div>
          </div>

          <div className="view-selector">
            <button className={`view-btn ${view === 'hotels' ? 'active' : ''}`} onClick={() => setView('hotels')}>
              <Hotel size={20} /> Hoteles <span className="tab-count">{hotels.length}</span>
            </button>
            <button className={`view-btn ${view === 'packages' ? 'active' : ''}`} onClick={() => setView('packages')}>
              <Package size={20} /> Paquetes <span className="tab-count">{packages.length}</span>
            </button>
            <button className={`view-btn ${view === 'transports' ? 'active' : ''}`} onClick={() => setView('transports')}>
              <Plane size={20} /> Transportes <span className="tab-count">{transports.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="results-body">
        {error && <div className="error-banner">{error}</div>}

        {/* --- VISTA HOTELES --- */}
        {view === 'hotels' && (
          <div className="fade-in">
            {hotels.length === 0 ? (
              <EmptyState type="hoteles" location={getCityName(destId)} icon={<Hotel size={40} />} />
            ) : (
              <div className="results-grid">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="card">
                    <div className="card-image">
                      <img src={hotel.imagen || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'} alt={hotel.nombre} onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Hotel'} />
                      <span className="card-badge badge-hotel">Hotel</span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{hotel.nombre}</h3>
                        <div className="rating">
                          <Star size={14} fill="currentColor" /> {hotel.estrellas}.0
                        </div>
                      </div>
                      <p className="card-location"><MapPin size={16} /> {hotel.direccion || getCityName(destId)}</p>
                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Por noche</span>
                          <span className="price-amount">${(hotel.precio || 1200).toLocaleString()}</span>
                        </div>
                        <button className="btn-action" onClick={() => navigate(`/hotel/${hotel.id}`)}>Ver Disponibilidad</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- VISTA PAQUETES --- */}
        {view === 'packages' && (
          <div className="fade-in">
            {packages.length === 0 ? (
              <EmptyState type="paquetes" location={getCityName(destId)} icon={<Package size={40} />} />
            ) : (
              <div className="results-grid">
                {packages.map((pkg) => (
                  <div key={pkg.paquete_id || pkg.id} className="card">
                    <div className="card-image">
                      <img src={pkg.hotel_imagen || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} alt={pkg.descripcion} onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Paquete'} />
                      <span className="card-badge badge-package">Todo Incluido</span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{pkg.tipo_paquete || 'Paquete Turístico'}</h3>
                      </div>
                      
                      <div className="details-list">
                        <div className="detail-item">
                          <div className="detail-icon-wrapper"><Hotel size={16}/></div>
                          <span>{pkg.hotel_nombre || 'Hotel incluido'}</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon-wrapper">{getTransportIcon(pkg.transporte)}</div>
                          <span>{pkg.transporte} incluido</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon-wrapper"><Clock size={16}/></div>
                          <span>{pkg.tiempo_estadia} días</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Precio Total</span>
                          <span className="price-amount">${pkg.precio?.toLocaleString()}</span>
                        </div>
                        <button className="btn-action secondary" onClick={() => navigate(`/paquete/${pkg.paquete_id || pkg.id}`)}>Reservar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- VISTA TRANSPORTES --- */}
        {view === 'transports' && (
          <div className="fade-in">
            {transports.length === 0 ? (
              <EmptyState type="transportes" location="esta ruta" icon={<Plane size={40} />} />
            ) : (
              <div className="results-grid">
                {transports.map((transport) => (
                  <div key={transport.id} className="card">
                    <div className="card-image">
                      <img src={getTransportImage(transport.tipo)} alt={transport.nombre} />
                      <span className={`card-badge badge-transport transport-${transport.tipo?.toLowerCase()}`}>
                        {getTransportIcon(transport.tipo)} {transport.tipo}
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{transport.nombre}</h3>
                        <p style={{color: 'var(--text-light)', margin: '0.2rem 0 0 0', fontSize: '0.95rem'}}>{transport.modelo}</p>
                      </div>
                      
                      <div className="details-list">
                        <div className="detail-item">
                          <div className="detail-icon-wrapper"><Users size={16}/></div>
                          <span>Capacidad: {transport.capacidad} pasajeros</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon-wrapper" style={{color: transport.asientos_disponibles > 0 ? '#16a34a' : '#dc2626'}}>
                            <CheckCircle size={16} />
                          </div>
                          <span style={{fontWeight: '600', color: transport.asientos_disponibles > 0 ? '#16a34a' : '#dc2626'}}>
                            {transport.asientos_disponibles} asientos disponibles
                          </span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Por pasajero</span>
                          <span className="price-amount">${(transport.precio || 0).toLocaleString()}</span>
                        </div>
                        <button className="btn-action" onClick={() => navigate(`/transporte/${transport.id}`)}>Seleccionar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para Estado Vacío
const EmptyState = ({ type, location, icon }) => (
  <div className="empty-state fade-in">
    <div className="empty-icon-wrapper">
      {icon}
    </div>
    <h3>No encontramos {type} disponibles en {location}</h3>
    <p>Intenta cambiar las fechas o verifica otros destinos.</p>
  </div>
);

export default Results;