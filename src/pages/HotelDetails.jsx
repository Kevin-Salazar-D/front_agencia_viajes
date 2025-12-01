import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, ArrowLeft, Wifi, Coffee, Utensils, Car, Wind, Tv, 
  Clock, Info, Phone, AlertCircle, CheckCircle, X, LogIn
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Datos
  const [hotel, setHotel] = useState(null);
  const [details, setDetails] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [cityName, setCityName] = useState('Cargando ubicación...');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fechas
  const [dates, setDates] = useState({
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // --- ESTADO PARA LAS ALERTAS PERSONALIZADAS ---
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'info', // 'info', 'error', 'confirm'
    title: '',
    message: '',
    onConfirm: null // Función a ejecutar si es confirmación
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadFullData();
  }, [id]);

  // Helper para mostrar alertas bonitas
  const showAlert = (type, title, message, onConfirm = null) => {
    setAlertState({ isOpen: true, type, title, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`Advertencia al cargar ${url}:`, err.message);
      return null;
    }
  };

  const loadFullData = async () => {
    try {
      setLoading(true);
      setError(null);

      const hotelsData = await safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`);
      const hotelsList = Array.isArray(hotelsData) ? hotelsData : [];
      const currentHotel = hotelsList.find(h => h.id.toString() === id.toString());

      if (!currentHotel) {
        throw new Error("El hotel solicitado no existe.");
      }
      setHotel(currentHotel);
      setSelectedImage(currentHotel.imagen);

      const [detailsData, imagesData, citiesData] = await Promise.all([
        safeFetch(`${API_BASE}/hotelDetalles/mostrarDetallesDeUnHotel/${id}`),
        safeFetch(`${API_BASE}/hotelImagenes/mostrarImagenHotel?hotel_id=${id}`),
        safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`)
      ]);

      setDetails(detailsData || {});

      const extraImages = Array.isArray(imagesData) ? imagesData : [];
      const fullGallery = currentHotel.imagen 
        ? [{ id: 'main', url: currentHotel.imagen }, ...extraImages]
        : extraImages;
      setGallery(fullGallery);

      const citiesList = Array.isArray(citiesData) ? citiesData : [];
      const city = citiesList.find(c => c.id === currentHotel.ciudad_id);
      if (city) {
        setCityName(`${city.nombre}, ${city.pais}`);
      } else {
        setCityName('Ubicación desconocida');
      }

    } catch (err) {
      console.error("Error cargando hotel:", err);
      setError(err.message || "Error al cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  const calculations = useMemo(() => {
      if (!hotel) return { nights: 0, total: 0, price: 0 };
      const basePrice = Number(details?.precio_noche) || Number(hotel.precio) || 0;
      const start = new Date(dates.start);
      const end = new Date(dates.end);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return { nights: 0, total: 0, price: basePrice };
      }

      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const nights = diffDays > 0 ? diffDays : 0;
      const total = nights * basePrice;

      return { nights, total, price: basePrice };
  }, [dates, hotel, details]);

  // --- MANEJO DE RESERVA Y LOGIN CON ALERTAS BONITAS ---
  const handleReserveClick = () => {
    // 1. Validar fechas
    if (calculations.nights <= 0) {
        showAlert('error', 'Fechas inválidas', 'La fecha de salida debe ser posterior a la fecha de llegada.');
        return;
    }

    // 2. Verificar sesión
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        // Reemplazo del window.confirm feo
        showAlert(
            'confirm', 
            'Inicia sesión para continuar', 
            'Necesitas una cuenta para poder realizar reservaciones y asegurar tu viaje.',
            () => navigate('/login') // Acción al confirmar
        );
        return;
    }
   const paymentState = {
        hotel: hotel,
        details: details,
        dates: dates,
        totalDays: calculations.nights,
        totalPrice: calculations.total
    };

    // 4. Console log completo
    console.log('Datos que se envían a PaymentGateway:', paymentState);

    // 5. Redirigir a Pasarela
    navigate('/payment', { state: paymentState });
  };

  const getAmenitiesList = () => {
    if (!details?.amenidades || typeof details.amenidades !== 'string') return [];
    return details.amenidades.split(',').map(a => a.trim()).filter(a => a);
  };

  const getAmenityIcon = (index) => {
    const icons = [Wifi, Coffee, Utensils, Car, Wind, Tv];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={18} className="text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando hotel...</p>
        <style>{`
          .loading-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #2563eb; background: #f9fafb; }
          .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={64} color="#ef4444" />
        <h2>¡Ups! Hubo un problema</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al Inicio</button>
        <style>{`
          .error-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; background: #f9fafb; padding: 2rem; }
          .btn-primary { background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        `}</style>
      </div>
    );
  }

  const amenitiesList = getAmenitiesList();

  return (
    <div className="hotel-page">
      {/* Navegación */}
      <nav className="nav-bar">
        <div className="nav-content">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} /> Volver
          </button>
          <span className="nav-title">{hotel.nombre}</span>
          <button onClick={handleReserveClick} className="btn-book-sm">
            Reservar
          </button>
        </div>
      </nav>

      <div className="main-container">
        <header className="hotel-header">
          <div className="header-info">
            <div className="badges">
              <span className="badge-stars"><Star size={14} fill="currentColor" /> {hotel.estrellas} Estrellas</span>
              <span className="badge-city"><MapPin size={14} /> {cityName}</span>
            </div>
            <h1 className="hotel-title">{hotel.nombre}</h1>
            <p className="hotel-address">{hotel.direccion}</p>
          </div>
          <div className="header-price">
            <span className="price-label">Precio por noche desde</span>
            <span className="price-amount">${calculations.price.toLocaleString()}</span>
          </div>
        </header>

        <section className="gallery-section">
          <div className="main-image-container">
            <img 
              src={selectedImage || 'https://via.placeholder.com/1200x600?text=Sin+Imagen'} 
              alt="Vista principal" 
              className="main-image"
              onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Imagen+No+Disponible'}
            />
          </div>
          {gallery.length > 1 && (
            <div className="thumbnails">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumb-btn ${selectedImage === img.url ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={`Vista ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="content-grid">
          {/* Detalles (Izquierda) */}
          <div className="details-column">
            <div className="section-card">
              <h3>Descripción</h3>
              <p className="description-text">
                {details?.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            <div className="section-card">
              <h3>Lo que ofrece este lugar</h3>
              {amenitiesList.length > 0 ? (
                <div className="amenities-grid">
                    {amenitiesList.map((item, idx) => (
                    <div key={idx} className="amenity-item">
                        {getAmenityIcon(idx)}
                        <span>{item}</span>
                    </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Servicios no especificados.</p>
              )}
            </div>

            <div className="section-card">
              <h3>Políticas y Horarios</h3>
              <div className="policies-grid">
                <div className="policy-item">
                  <Clock size={20} className="text-gray-400" />
                  <div>
                    <strong>Check-in</strong>
                    <p>{details?.check_in || 'Consultar'}</p>
                  </div>
                </div>
                <div className="policy-item">
                  <Clock size={20} className="text-gray-400" />
                  <div>
                    <strong>Check-out</strong>
                    <p>{details?.check_out || 'Consultar'}</p>
                  </div>
                </div>
              </div>
              {details?.politicas && (
                <div className="policy-text-block">
                  <strong>Reglas del alojamiento:</strong>
                  <p>{details.politicas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reserva Sticky (Derecha) */}
          <div className="booking-column">
            <div className="booking-card">
              <div className="booking-header">
                <span className="price-large">${calculations.price.toLocaleString()}</span>
                <span className="price-unit"> / noche</span>
              </div>
              
              <div className="date-selector">
                <div className="date-input-group">
                    <label>Llegada</label>
                    <input 
                        type="date" 
                        value={dates.start} 
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setDates({...dates, start: e.target.value})} 
                    />
                </div>
                <div className="date-input-group">
                    <label>Salida</label>
                    <input 
                        type="date" 
                        value={dates.end} 
                        min={dates.start}
                        onChange={e => setDates({...dates, end: e.target.value})} 
                    />
                </div>
              </div>

              <div className="booking-info">
                 <div className="info-row">
                    <Phone size={16} /> <span>{hotel.telefono || 'Sin teléfono'}</span>
                 </div>
                 <div className="info-row">
                    <Info size={16} /> <span>{details?.retricciones || 'Sin restricciones'}</span>
                 </div>
              </div>

              <button className="btn-book-full" onClick={handleReserveClick}>
                Reservar Ahora
              </button>
              <p className="charge-notice">No se te cobrará nada todavía</p>
              
              <div className="total-preview">
                 <div className="total-row">
                    <span>Estancia ({calculations.nights} noches)</span>
                    <span>${calculations.total.toLocaleString()}</span>
                 </div>
                 <div className="total-row total-final">
                    <span>Total</span>
                    <span>${calculations.total.toLocaleString()} MXN</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL DE ALERTAS PERSONALIZADO --- */}
        {alertState.isOpen && (
          <div className="alert-overlay" onClick={closeAlert}>
            <div className="alert-modal" onClick={e => e.stopPropagation()}>
              <button className="alert-close" onClick={closeAlert}><X size={20}/></button>
              
              <div className={`alert-icon-wrapper ${alertState.type}`}>
                {alertState.type === 'error' && <AlertCircle size={32} />}
                {alertState.type === 'info' && <Info size={32} />}
                {alertState.type === 'confirm' && <LogIn size={32} />}
                {alertState.type === 'success' && <CheckCircle size={32} />}
              </div>
              
              <h3 className="alert-title">{alertState.title}</h3>
              <p className="alert-message">{alertState.message}</p>
              
              <div className="alert-actions">
                {alertState.type === 'confirm' ? (
                  <>
                    <button className="btn-cancel" onClick={closeAlert}>Cancelar</button>
                    <button className="btn-confirm" onClick={() => {
                      if (alertState.onConfirm) alertState.onConfirm();
                      closeAlert();
                    }}>
                      Ir al Login
                    </button>
                  </>
                ) : (
                  <button className="btn-confirm" onClick={closeAlert}>Entendido</button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .hotel-page {
          background-color: #f3f4f6;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          padding-bottom: 4rem;
        }

        /* NAV */
        .nav-bar {
          background: white;
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.75rem 0;
        }
        .nav-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-title { font-weight: 600; color: #1f2937; display: none; }
        @media(min-width: 768px) { .nav-title { display: block; } }

        .btn-back {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem;
          color: #4b5563; font-weight: 500;
        }
        .btn-back:hover { color: #2563eb; }
        
        .btn-book-sm {
          background: #2563eb; color: white; border: none;
          padding: 0.5rem 1rem; borderRadius: 6px; font-weight: 600;
          cursor: pointer;
        }

        /* MAIN */
        .main-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* HEADER */
        .hotel-header { margin: 2rem 0; display: flex; justify-content: space-between; align-items: flex-end; }
        .hotel-title { font-size: 2.5rem; font-weight: 800; color: #1f2937; margin: 0.5rem 0; line-height: 1.1; }
        .hotel-address { color: #6b7280; font-size: 1rem; margin: 0; }
        
        .badges { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
        .badge-stars { display: flex; align-items: center; gap: 4px; color: #f59e0b; font-weight: 600; background: #fffbeb; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }
        .badge-city { display: flex; align-items: center; gap: 4px; color: #2563eb; font-weight: 600; background: #eff6ff; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }

        .header-price { text-align: right; display: none; }
        @media(min-width: 768px) { .header-price { display: block; } }
        .price-label { display: block; color: #6b7280; font-size: 0.85rem; }
        .price-amount { font-size: 2rem; font-weight: 800; color: #1f2937; }

        /* GALLERY */
        .gallery-section { margin-bottom: 3rem; }
        .main-image-container {
          width: 100%; height: 450px; border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1); background: #e5e7eb;
        }
        .main-image { width: 100%; height: 100%; object-fit: cover; }
        
        .thumbnails { display: flex; gap: 1rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .thumb-btn {
          width: 100px; height: 70px; flex-shrink: 0; border: 2px solid transparent;
          border-radius: 8px; overflow: hidden; cursor: pointer; padding: 0;
          transition: all 0.2s;
        }
        .thumb-btn.active { border-color: #2563eb; transform: scale(1.05); }
        .thumb-btn img { width: 100%; height: 100%; object-fit: cover; }

        /* GRID */
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media(min-width: 900px) { .content-grid { grid-template-columns: 2fr 1fr; } }

        /* CARDS */
        .section-card { background: white; padding: 2rem; border-radius: 16px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .section-card h3 { margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #1f2937; font-weight: 700; }
        
        .description-text { color: #4b5563; line-height: 1.8; white-space: pre-line; }

        .amenities-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .amenity-item { display: flex; align-items: center; gap: 10px; color: #374151; }
        .text-gray-500 { color: #6b7280; }
        .italic { font-style: italic; }

        .policies-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .policy-item { display: flex; gap: 12px; align-items: flex-start; background: #f9fafb; padding: 1rem; border-radius: 8px; }
        .policy-item p { margin: 0; font-weight: 600; color: #1f2937; }
        
        .policy-text-block { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f3f4f6; font-size: 0.9rem; color: #4b5563; }
        .cancel-policy { color: #dc2626; }

        /* BOOKING CARD */
        .booking-column { position: relative; }
        .booking-card {
          background: white; padding: 2rem; border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: sticky; top: 100px; border: 1px solid #e5e7eb;
        }
        .booking-header { margin-bottom: 1.5rem; display: flex; align-items: baseline; gap: 4px; }
        .price-large { font-size: 1.75rem; font-weight: 800; color: #1f2937; }
        .price-unit { color: #6b7280; }

        .date-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem; }
        .date-input-group label { display: block; font-size: 0.8rem; color: #6b7280; margin-bottom: 4px; }
        .date-input-group input { width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; }

        .booking-info { background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
        .info-row { display: flex; gap: 10px; margin-bottom: 0.5rem; font-size: 0.9rem; color: #4b5563; }
        .info-row:last-child { margin: 0; }

        .btn-book-full {
          width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white; border: none; padding: 1rem; border-radius: 8px;
          font-size: 1.1rem; font-weight: 700; cursor: pointer;
          transition: transform 0.1s, box-shadow 0.2s;
        }
        .btn-book-full:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3); }
        
        .charge-notice { text-align: center; color: #6b7280; font-size: 0.85rem; margin-top: 1rem; }

        .total-preview { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #4b5563; }
        .total-final { font-weight: 700; color: #1f2937; font-size: 1.1rem; margin-top: 1rem; }

        /* --- ALERT MODAL STYLES --- */
        .alert-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); z-index: 1000;
          display: flex; justify-content: center; align-items: center;
          backdrop-filter: blur(4px); animation: fadeIn 0.2s ease-out;
        }
        .alert-modal {
          background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px;
          text-align: center; position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease-out;
        }
        .alert-close {
          position: absolute; top: 10px; right: 10px; background: none; border: none;
          color: #9ca3af; cursor: pointer; padding: 5px;
        }
        .alert-icon-wrapper {
          width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1.5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .alert-icon-wrapper.error { background: #fee2e2; color: #dc2626; }
        .alert-icon-wrapper.confirm { background: #e0e7ff; color: #4f46e5; }
        .alert-icon-wrapper.info { background: #eff6ff; color: #2563eb; }
        
        .alert-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
        .alert-message { color: #6b7280; margin-bottom: 2rem; line-height: 1.5; }
        
        .alert-actions { display: flex; gap: 10px; }
        .btn-confirm {
          flex: 1; background: #2563eb; color: white; border: none; padding: 12px;
          border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .btn-cancel {
          flex: 1; background: white; border: 1px solid #e5e7eb; color: #374151; padding: 12px;
          border-radius: 8px; font-weight: 600; cursor: pointer;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default HotelDetails;