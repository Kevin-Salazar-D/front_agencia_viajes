import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowLeft, Loader, Star, Package, Hotel, 
  Calendar, Plane, Bus, Clock, Users, CheckCircle 
} from 'lucide-react';

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estado
  const [view, setView] = useState('hotels'); // 'hotels' | 'packages' | 'transports'
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [transports, setTransports] = useState([]); // 👈 Nuevo estado
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Params URL
  const originId = searchParams.get('from');
  const destId = searchParams.get('to');
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  // API Base
  const API_BASE = 'http://localhost:3000/agenciaViajes';

  // Helper para fetch seguro
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

      // 1. Cargar TODOS los datos (incluyendo transportes)
      const [citiesData, hotelsData, packagesData, transportsData] = await Promise.all([
        safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`),
        safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`), 
        safeFetch(`${API_BASE}/paquetes/mostrarTodosPaquetes`),
        safeFetch(`${API_BASE}/transportes/obtenerTodosTransportes`) // 👈 Nuevo fetch
      ]);

      const citiesList = Array.isArray(citiesData) ? citiesData : [];
      setCities(citiesList);
      
      // 2. Filtrar HOTELES por destino
      const allHotels = Array.isArray(hotelsData) ? hotelsData : [];
      let filteredHotels = [];
      
      if (destId) {
        filteredHotels = allHotels.filter(h => 
          parseInt(h.ciudad_id) === parseInt(destId) || 
          parseInt(h.id_ciudad) === parseInt(destId)
        );
      } else {
        filteredHotels = allHotels;
      }
      setHotels(filteredHotels);

      // 3. Filtrar PAQUETES por destino
      let allPackages = Array.isArray(packagesData) ? packagesData : [];
      let filteredPackages = [];

      if (destId) {
        const destCity = citiesList.find(c => c.id === parseInt(destId));
        filteredPackages = allPackages.filter(pkg => {
          const cityIdMatch = pkg.ciudad_id && parseInt(pkg.ciudad_id) === parseInt(destId);
          const cityNameMatch = destCity && pkg.ciudad && 
                                pkg.ciudad.toLowerCase().trim() === destCity.nombre.toLowerCase().trim();
          return cityIdMatch || cityNameMatch;
        });
      } else {
        filteredPackages = allPackages;
      }
      setPackages(filteredPackages);

      // 4. Procesar TRANSPORTES
      // Como los transportes suelen ser rutas (origen-destino), y tu tabla es simple,
      // mostraremos todos los disponibles para que el usuario elija cómo llegar.
      const allTransports = Array.isArray(transportsData) ? transportsData : [];
      setTransports(allTransports);

      // Lógica de vista inicial inteligente
      if (filteredHotels.length === 0) {
        if (filteredPackages.length > 0) setView('packages');
        else if (allTransports.length > 0) setView('transports');
      }

    } catch (err) {
      console.error('Error general cargando resultados:', err);
      setError('Hubo un problema al cargar las opciones.');
    } finally {
      setLoading(false);
    }
  };

  const getCityName = (id) => {
    if (!id) return '...';
    const city = cities.find(c => c.id === parseInt(id));
    return city?.nombre || 'Desconocido';
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getTransportIcon = (type) => {
    if (!type) return <Bus size={16} />;
    return type.toLowerCase().includes('avion') ? <Plane size={16} /> : <Bus size={16} />;
  };

  // Función para obtener imagen de transporte (simulada)
  const getTransportImage = (type) => {
    if (type?.toLowerCase() === 'avion') return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&auto=format&fit=crop&q=60';
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=60';
  };

  if (loading) {
    return (
      <div className="results-page loading-center">
        <Loader size={48} className="spinner" />
        <p>Buscando las mejores ofertas...</p>
        <style>{`
          .loading-center { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: #2563eb; }
          .spinner { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Header */}
      <header className="results-header">
        <div className="results-container">
          <div className="header-top">
            <button className="btn-back" onClick={() => navigate('/')}>
              <ArrowLeft size={20} /> Volver
            </button>
            <div className="trip-summary">
              <span className="badge-date">{startDate} - {endDate}</span>
            </div>
          </div>
          
          <div className="header-content">
            <h1>Explora {getCityName(destId)}</h1>
            <p className="subtitle">Origen: {getCityName(originId)} • {calculateNights()} noches</p>
          </div>

          {/* Selector de Vista (Tabs) - AHORA CON TRANSPORTES */}
          <div className="view-selector">
            <button 
              className={`view-btn ${view === 'hotels' ? 'active' : ''}`}
              onClick={() => setView('hotels')}
            >
              <Hotel size={18} /> Hoteles ({hotels.length})
            </button>
            <button 
              className={`view-btn ${view === 'packages' ? 'active' : ''}`}
              onClick={() => setView('packages')}
            >
              <Package size={18} /> Paquetes ({packages.length})
            </button>
            <button 
              className={`view-btn ${view === 'transports' ? 'active' : ''}`}
              onClick={() => setView('transports')}
            >
              <Plane size={18} /> Transportes ({transports.length})
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="results-body results-container">
        {error && <div className="error-banner">{error}</div>}

        {/* VISTA DE HOTELES */}
        {view === 'hotels' && (
          <div className="fade-in">
            {hotels.length === 0 ? (
              <EmptyState type="hoteles" location={getCityName(destId)} />
            ) : (
              <div className="results-grid">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="card hotel-card">
                    <div className="card-image">
                      <img 
                        src={hotel.imagen || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                        alt={hotel.nombre}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Hotel'}
                      />
                      <span className="card-badge">Hotel</span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{hotel.nombre}</h3>
                        <div className="rating">
                          <Star size={14} fill="currentColor" /> {hotel.estrellas}.0
                        </div>
                      </div>
                      <p className="card-location"><MapPin size={14} /> {hotel.direccion || getCityName(destId)}</p>
                      
                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Por noche</span>
                          <span className="price-amount">${(hotel.precio || 1200).toLocaleString()}</span>
                        </div>
                        <button className="btn-action" onClick={() => navigate(`/hotel/${hotel.id}`)}>
                          Ver Disponibilidad
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA DE PAQUETES */}
        {view === 'packages' && (
          <div className="fade-in">
            {packages.length === 0 ? (
              <EmptyState type="paquetes" location={getCityName(destId)} />
            ) : (
              <div className="results-grid">
                {packages.map((pkg) => (
                  <div key={pkg.paquete_id || pkg.id} className="card package-card">
                    <div className="card-image">
                      <img 
                        src={pkg.hotel_imagen || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'} 
                        alt={pkg.descripcion}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Paquete'}
                      />
                      <span className="card-badge package-badge">Todo Incluido</span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="package-title">{pkg.tipo_paquete || 'Paquete Turístico'}</h3>
                        <div className="transport-icon" title={pkg.transporte}>
                           {getTransportIcon(pkg.transporte)}
                        </div>
                      </div>
                      <p className="package-desc">{pkg.paquete_descripcion || pkg.descripcion}</p>
                      
                      <div className="package-details">
                        <div className="detail-item">
                            <Hotel size={14} /> <span>{pkg.hotel_nombre || 'Hotel incluido'}</span>
                        </div>
                        <div className="detail-item">
                            <Clock size={14} /> <span>{pkg.tiempo_estadia} días</span>
                        </div>
                        <div className="detail-item">
                            <Users size={14} /> <span>{pkg.ciudad || getCityName(destId)}</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Precio Total</span>
                          <span className="price-amount">${pkg.precio?.toLocaleString()}</span>
                        </div>
                        <button className="btn-action btn-package" onClick={() => navigate(`/paquete/${pkg.paquete_id || pkg.id}`)}>
                          Reservar Paquete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA DE TRANSPORTES (NUEVA) */}
        {view === 'transports' && (
          <div className="fade-in">
            {transports.length === 0 ? (
              <EmptyState type="transportes" location="tu búsqueda" />
            ) : (
              <div className="results-grid">
                {transports.map((transport) => (
                  <div key={transport.id} className="card transport-card">
                    <div className="card-image">
                      <img 
                        src={getTransportImage(transport.tipo)} 
                        alt={transport.nombre}
                      />
                      <span className={`card-badge transport-badge ${transport.tipo}`}>
                        {getTransportIcon(transport.tipo)} {transport.tipo}
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3>{transport.nombre}</h3>
                        <div className="rating" style={{color: '#4b5563'}}>
                           <span style={{fontSize: '0.85rem'}}>{transport.modelo}</span>
                        </div>
                      </div>
                      
                      <div className="package-details" style={{marginTop: '10px'}}>
                        <div className="detail-item">
                            <Users size={14} /> <span>Cap: {transport.capacidad}</span>
                        </div>
                        <div className="detail-item" style={{background: transport.asientos_disponibles > 0 ? '#dcfce7' : '#fee2e2'}}>
                            <CheckCircle size={14} color={transport.asientos_disponibles > 0 ? '#166534' : '#991b1b'} /> 
                            <span style={{color: transport.asientos_disponibles > 0 ? '#166534' : '#991b1b'}}>
                                {transport.asientos_disponibles} disp.
                            </span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="price-info">
                          <span className="price-label">Precio por persona</span>
                          <span className="price-amount">${(transport.precio || 0).toLocaleString()}</span>
                        </div>
                        <button className="btn-action" onClick={() => navigate(`/transporte/${transport.id}`)}>
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --accent: #f59e0b;
          --bg: #f3f4f6;
          --surface: #ffffff;
          --text: #1f2937;
          --text-light: #6b7280;
        }

        .results-page {
          min-height: 100vh;
          background-color: var(--bg);
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* HEADER */
        .results-header {
          background: var(--surface);
          box-shadow: 0 4px 20px -10px rgba(0,0,0,0.1);
          padding: 1.5rem 0 0 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .btn-back {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-back:hover { color: var(--primary); }

        .trip-summary {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .badge-date {
          background: #eef2ff;
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }

        .header-content h1 {
          font-size: 1.8rem;
          margin: 0;
          color: var(--text);
        }
        .subtitle {
          color: var(--text-light);
          margin-top: 0.25rem;
        }

        /* TABS */
        .view-selector {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto; /* Scroll en móvil */
        }

        .view-btn {
          background: none;
          border: none;
          padding: 1rem 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .view-btn:hover { color: var(--primary); }
        .view-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        /* BODY */
        .results-body { padding-top: 2rem; padding-bottom: 4rem; }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        /* CARDS */
        .card {
          background: var(--surface);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .card-image {
          height: 200px;
          position: relative;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.95);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .package-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        
        .transport-badge {
           color: white;
           display: flex; align-items: center; gap: 5px; text-transform: capitalize;
        }
        .transport-badge.avion { background: #0ea5e9; }
        .transport-badge.camion { background: #f59e0b; }

        .card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text);
          font-weight: 700;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .card-location {
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        /* Package specific */
        .package-desc {
          color: var(--text-light);
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .package-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text);
        }

        .transport-icon {
          background: #e0e7ff;
          color: var(--primary);
          padding: 6px;
          border-radius: 50%;
          display: flex;
        }

        /* FOOTER */
        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .price-info {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-amount {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary-dark);
        }

        .btn-action {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-action:hover { background: var(--primary-dark); }
        
        .btn-package {
          background: var(--text); 
        }
        .btn-package:hover { background: black; }

        /* Animation */
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .empty-icon { opacity: 0.3; margin-bottom: 1rem; color: var(--text-light); }
      `}</style>
    </div>
  );
};

// Componente pequeño para estado vacío
const EmptyState = ({ type, location }) => (
  <div className="empty-state fade-in">
    <MapPin size={64} className="empty-icon" />
    <h3>No encontramos {type} disponibles en {location}</h3>
    <p style={{ color: '#6b7280' }}>
      Intenta cambiar las fechas o verifica otros destinos.
    </p>
  </div>
);

export default Results;