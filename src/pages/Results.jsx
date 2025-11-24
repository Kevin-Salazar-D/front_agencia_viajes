import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Loader, Star } from 'lucide-react';
import { getHotelsByCity } from '../services/hotels';
import { getCities } from '../services/cities';
import '../App.css';

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const originId = searchParams.get('from');
  const destId = searchParams.get('to');
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar ciudades y hoteles
      const [citiesRes, hotelsRes] = await Promise.all([
        getCities(),
        getHotelsByCity(destId)
      ]);

      setCities(citiesRes.data || []);
      setHotels(hotelsRes.data || []);
    } catch (err) {
      console.error('Error cargando resultados:', err);
      setError('Error al cargar los resultados. Intenta de nuevo.');
      
      // Datos de respaldo
      setCities([
        { id: 1, nombre: 'Cancún' },
        { id: 2, nombre: 'Ciudad de México' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getOriginCityName = () => {
    const city = cities.find(c => c.id === parseInt(originId));
    return city?.nombre || 'Origen desconocido';
  };

  const getDestCityName = () => {
    const city = cities.find(c => c.id === parseInt(destId));
    return city?.nombre || 'Destino desconocido';
  };

  const calculateNights = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="results-page">
        <header className="results-header">
          <div className="results-container">
            <button className="btn-back" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>
        </header>
        
        <div className="results-loading">
          <Loader size={48} className="spinner" />
          <p>Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Header */}
      <header className="results-header">
        <div className="results-container">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Volver
          </button>
          
          <div className="results-info">
            <h1>Resultados de búsqueda</h1>
            <p>
              <strong>{getOriginCityName()}</strong> → <strong>{getDestCityName()}</strong>
              <br />
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {startDate} a {endDate} ({calculateNights()} noches)
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="results-container">
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {hotels.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <MapPin size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3>No hay hoteles disponibles</h3>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Intenta con otras fechas o ciudades
            </p>
          </div>
        ) : (
          <div className="results-grid">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="result-card">
                <div className="result-image">
                  <img 
                    src={hotel.imagen || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                    alt={hotel.nombre}
                  />
                  <div className="result-badge">Disponible</div>
                </div>

                <div className="result-content">
                  <h3>{hotel.nombre}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {hotel.direccion || 'Ubicación céntrica'}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    color: '#f59e0b'
                  }}>
                    <Star size={16} fill="currentColor" />
                    <span style={{ color: '#333', fontWeight: '600' }}>
                      4.5 (234 reviews)
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #eee',
                    paddingTop: '1rem'
                  }}>
                    <div>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        {calculateNights()} noches
                      </span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                        ${(hotel.precio || 5999).toLocaleString('es-MX')}
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/hotel/${hotel.id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        fontSize: '0.9rem'
                      }}
                      onMouseOver={(e) => e.target.style.boxShadow = '0 10px 20px rgba(37, 99, 235, 0.3)'}
                      onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .results-page {
          min-height: 100vh;
          background: #f9fafb;
        }

        .results-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 2rem 0;
          sticky: 0;
          top: 0;
          z-index: 10;
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 1rem;
          padding: 0;
          transition: color 0.2s;
        }

        .btn-back:hover {
          color: #1d4ed8;
        }

        .results-info h1 {
          font-size: 2rem;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .results-info p {
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        .results-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }

        .result-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .result-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          transform: translateY(-4px);
        }

        .result-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .result-card:hover .result-image img {
          transform: scale(1.05);
        }

        .result-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #f97316, #ec4899);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .result-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .result-content h3 {
          font-size: 1.25rem;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: 1fr;
          }

          .results-info h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;