import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bus, Plane, Users, CheckCircle, Calendar, 
  DollarSign, AlertCircle, Shield, Info 
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fechas para la reserva (viaje sencillo o redondo simulado)
  const [dates, setDates] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadTransport();
  }, [id]);

  const loadTransport = async () => {
    try {
      setLoading(true);
      // Traemos todos y buscamos (estrategia segura usada antes)
      const response = await fetch(`${API_BASE}/transportes/obtenerTodosTransportes`);
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      
      const found = Array.isArray(data) 
        ? data.find(t => t.id.toString() === id.toString())
        : null;

      if (!found) throw new Error('Transporte no encontrado');
      setTransport(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImage = () => {
    if (!transport) return '';
    if (transport.tipo === 'avion') return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop';
  };

  const handleReserve = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      if(window.confirm("Necesitas iniciar sesión para reservar. ¿Ir al login?")) {
        navigate('/login');
      }
      return;
    }

    // Adaptamos el objeto "transporte" para que parezca un "hotel" 
    // y la Pasarela de Pago lo entienda sin romper el código existente.
    const mockHotelObj = {
      id: transport.id, // Usamos ID del transporte
      nombre: transport.nombre, // Nombre aerolínea/bus
      direccion: `${transport.tipo.toUpperCase()} - ${transport.modelo}`, // Usamos modelo como dirección visual
      estrellas: 0,
      imagen: getImage(),
      telefono: 'Línea de Atención'
    };

    // Cálculo simple: Precio base por día (renta o boleto)
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const total = days * (transport.precio || 0);

    navigate('/payment', {
      state: {
        hotel: mockHotelObj, // Pasamos el transporte disfrazado
        details: { precio_noche: transport.precio },
        dates: dates,
        totalDays: days,
        totalPrice: total
      }
    });
  };

  if (loading) return <div className="screen-center"><div className="spinner"></div></div>;
  if (error) return <div className="screen-center"><AlertCircle size={48} color="#ef4444"/><p>{error}</p><button onClick={() => navigate(-1)}>Volver</button></div>;

  return (
    <div className="details-page">
      <nav className="details-nav">
        <div className="nav-content">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} /> Volver
          </button>
          <span className="nav-title">{transport.nombre}</span>
          <button onClick={handleReserve} className="btn-book-sm">Reservar</button>
        </div>
      </nav>

      <div className="main-container">
        {/* Hero */}
        <div className="hero-section">
          <img src={getImage()} alt={transport.nombre} className="hero-bg" />
          <div className="hero-overlay">
            <div className="hero-content">
              <span className={`type-badge ${transport.tipo}`}>
                {transport.tipo === 'avion' ? <Plane size={16}/> : <Bus size={16}/>} {transport.tipo}
              </span>
              <h1>{transport.nombre}</h1>
              <p className="model-text">{transport.modelo}</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="info-column">
            <div className="info-card">
              <h2>Detalles del Vehículo</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <Users size={24} className="spec-icon" />
                  <div>
                    <label>Capacidad</label>
                    <strong>{transport.capacidad} Pasajeros</strong>
                  </div>
                </div>
                <div className="spec-item">
                  <CheckCircle size={24} className="spec-icon" />
                  <div>
                    <label>Disponibilidad</label>
                    <strong>{transport.asientos_disponibles} Asientos libres</strong>
                  </div>
                </div>
                <div className="spec-item">
                  <Shield size={24} className="spec-icon" />
                  <div>
                    <label>Seguridad</label>
                    <strong>Seguro de viajero incl.</strong>
                  </div>
                </div>
              </div>
              
              <div className="description">
                <h3>Descripción</h3>
                <p>
                  Viaja con la comodidad y seguridad que {transport.nombre} ofrece. 
                  El modelo {transport.modelo} cuenta con asientos reclinables, 
                  aire acondicionado y entretenimiento a bordo para hacer tu viaje placentero.
                </p>
              </div>
            </div>
          </div>

          <div className="booking-column">
            <div className="booking-card">
              <div className="price-header">
                <span className="price-amount">${(transport.precio || 0).toLocaleString()}</span>
                <span className="price-period"> / boleto o día</span>
              </div>

              <div className="date-selector">
                <div className="input-group">
                  <label>Fecha Salida</label>
                  <input 
                    type="date" 
                    value={dates.start}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDates({...dates, start: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Fecha Regreso</label>
                  <input 
                    type="date" 
                    value={dates.end}
                    min={dates.start}
                    onChange={e => setDates({...dates, end: e.target.value})}
                  />
                </div>
              </div>

              <div className="info-row">
                <Info size={16} /> <span>Tarifa sujeta a disponibilidad</span>
              </div>

              <button className="btn-book-full" onClick={handleReserve}>
                Continuar a Pago
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .details-page { background: #f3f4f6; min-height: 100vh; padding-bottom: 4rem; font-family: 'Inter', sans-serif; }
        .screen-center { height: 100vh; display: flex; flexDirection: column; align-items: center; justify-content: center; color: #2563eb; gap: 1rem; }
        .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .details-nav { background: white; position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; }
        .nav-content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-title { font-weight: 600; color: #1f2937; }
        .btn-back { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; color: #4b5563; font-weight: 500; }
        .btn-back:hover { color: #2563eb; }
        .btn-book-sm { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; borderRadius: 6px; font-weight: 600; cursor: pointer; }

        .main-container { max-width: 1100px; margin: 0 auto; }
        
        /* Hero */
        .hero-section { position: relative; height: 400px; border-radius: 0 0 20px 20px; overflow: hidden; margin-bottom: 2rem; background: #1f2937; }
        .hero-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
        .hero-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .hero-content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; color: white; }
        .hero-content h1 { font-size: 3rem; margin: 0.5rem 0; font-weight: 800; }
        .type-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: #2563eb; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
        .type-badge.camion { background: #f59e0b; }
        .model-text { font-size: 1.2rem; opacity: 0.9; }

        .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; padding: 0 1.5rem; }
        
        .info-card, .booking-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .info-card h2 { margin-top: 0; color: #1f2937; }

        .specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .spec-item { display: flex; align-items: center; gap: 12px; }
        .spec-icon { color: #2563eb; background: #eff6ff; padding: 8px; width: 40px; height: 40px; border-radius: 8px; }
        .spec-item label { display: block; font-size: 0.8rem; color: #6b7280; }
        .spec-item strong { color: #1f2937; }

        .description { margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 2rem; }
        .description p { line-height: 1.6; color: #4b5563; }

        /* Booking Card */
        .booking-column { position: relative; }
        .booking-card { position: sticky; top: 100px; border: 1px solid #e5e7eb; }
        .price-header { margin-bottom: 1.5rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 1rem; }
        .price-amount { font-size: 2rem; font-weight: 800; color: #1f2937; }
        .price-period { color: #6b7280; }

        .date-selector { display: grid; gap: 1rem; margin-bottom: 1.5rem; }
        .input-group label { display: block; font-size: 0.85rem; color: #6b7280; margin-bottom: 4px; }
        .input-group input { width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; }

        .info-row { display: flex; gap: 8px; align-items: center; color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; }

        .btn-book-full { width: 100%; padding: 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
        .btn-book-full:hover { background: #1d4ed8; }

        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .hero-section { height: 300px; }
          .hero-content h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default TransportDetails;