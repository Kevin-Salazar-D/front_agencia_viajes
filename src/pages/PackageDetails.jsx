import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, ArrowLeft, Wifi, Coffee, Bus, Plane, Car, Calendar, 
  Clock, Info, CheckCircle, AlertCircle, Hotel, User, X, LogIn
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados de datos
  const [pkg, setPkg] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Estado para alertas personalizadas
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPackageData();
  }, [id]);

  // Helpers
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
      console.warn(`Error fetch ${url}:`, err.message);
      return null;
    }
  };

  const loadPackageData = async () => {
    try {
      setLoading(true);
      
      // 1. Obtener todos los paquetes (ya que el endpoint por ID no trae los JOINs completos a veces)
      const packagesData = await safeFetch(`${API_BASE}/paquetes/mostrarTodosPaquetes`);
      const packagesList = Array.isArray(packagesData) ? packagesData : [];

      console.log(packagesList);
      
      // Buscar el paquete actual (por ID de paquete o ID general)
      const currentPkg = packagesList.find(p => 
        (p.paquete_id && p.paquete_id.toString() === id.toString()) || 
        (p.id && p.id.toString() === id.toString())
      );

      if (!currentPkg) throw new Error("Paquete no encontrado");
      
      setPkg(currentPkg);
      setSelectedImage(currentPkg.hotel_imagen); // Imagen inicial del hotel asociado

      // 2. Cargar galería del HOTEL asociado al paquete
      if (currentPkg.hotel_id) {
        const imagesData = await safeFetch(`${API_BASE}/hotelImagenes/mostrarImagenHotel?hotel_id=${currentPkg.hotel_id}`);
        const extraImages = Array.isArray(imagesData) ? imagesData : [];
        
        const fullGallery = currentPkg.hotel_imagen 
            ? [{ id: 'main', url: currentPkg.hotel_imagen }, ...extraImages]
            : extraImages;
            
        setGallery(fullGallery);
      }

    } catch (err) {
      console.error("Error:", err);
      setError("No pudimos cargar la información del paquete.");
    } finally {
      setLoading(false);
    }
  };

  const handleReserveClick = () => {
    // 1. Verificar sesión
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        showAlert(
            'confirm', 
            'Inicia sesión para continuar', 
            'Necesitas una cuenta para poder reservar este paquete exclusivo.',
            () => navigate('/login')
        );
        return;
    }

    // 2. Preparar datos para la Pasarela de Pago
    // La pasarela espera un objeto 'hotel' y 'dates', así que adaptamos los datos del paquete
    const hotelObj = {
        id: pkg.hotel_id,
        nombre: pkg.hotel_nombre,
        direccion: pkg.hotel_direccion,
        estrellas: pkg.hotel_estrellas,
        imagen: pkg.hotel_imagen,
        telefono: pkg.hotel_telefono,
        paquete_id: pkg.paquete_id

    };
    console.log(hotelObj);

    const datesObj = {
        start: new Date(pkg.fecha_inicio).toISOString().split('T')[0],
        end: new Date(pkg.fecha_fin).toISOString().split('T')[0]
    };

    navigate('/payment', {
        state: {
            hotel: hotelObj,
            details: { precio_noche: 0 }, // En paquete el precio es total, no por noche relevante
            dates: datesObj,
            totalDays: pkg.tiempo_estadia,
            totalPrice: pkg.precio // Precio total del paquete
        }
    });
  };

  // Renderizado de Icono de Transporte
  const getTransportIcon = () => {
    if (!pkg?.transporte) return <Bus size={20} />;
    const type = pkg.transporte.toLowerCase();
    if (type.includes('avion') || type.includes('vuelo')) return <Plane size={20} />;
    if (type.includes('auto') || type.includes('coche')) return <Car size={20} />;
    return <Bus size={20} />;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div>Cargando paquete...</div>;
  if (error) return <div className="error-screen"><AlertCircle size={48}/><h2>{error}</h2><button onClick={() => navigate(-1)}>Regresar</button></div>;

  return (
    <div className="package-page">
      <nav className="nav-bar">
        <div className="nav-content">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} /> Volver
          </button>
          <span className="nav-title">Paquete: {pkg.tipo_paquete}</span>
          <button onClick={handleReserveClick} className="btn-book-sm">Reservar</button>
        </div>
      </nav>

      <div className="main-container">
        {/* Header */}
        <header className="pkg-header">
          <div className="header-info">
            <div className="badges">
               <span className="badge-transport">
                 {getTransportIcon()} {pkg.transporte || 'Transporte incluido'}
               </span>
               <span className="badge-hotel">
                 <Hotel size={14} /> {pkg.hotel_nombre}
               </span>
            </div>
            <h1 className="pkg-title">{pkg.tipo_paquete} en {pkg.ciudad}</h1>
            <p className="pkg-subtitle">
                <MapPin size={16} /> {pkg.hotel_direccion}
            </p>
          </div>
          <div className="header-price">
            <span className="price-label">Precio Total por Persona</span>
            <span className="price-amount">${Number(pkg.precio).toLocaleString()}</span>
          </div>
        </header>

        {/* Galería */}
        <section className="gallery-section">
          <div className="main-image-container">
            <img 
              src={selectedImage || 'https://via.placeholder.com/1200x600?text=Imagen+No+Disponible'} 
              alt="Vista principal" 
              className="main-image"
              onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=No+Image'}
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
            {/* Info Izquierda */}
            <div className="details-column">
                <div className="section-card highlight-card">
                    <h3><Info size={20}/> Detalles del Paquete</h3>
                    <p className="description-text">{pkg.paquete_descripcion || pkg.descripcion || "Sin descripción detallada."}</p>
                    
                    <div className="itinerary-grid">
                        <div className="itinerary-item">
                            <span className="label">Fecha Salida</span>
                            <span className="value"><Calendar size={16}/> {new Date(pkg.fecha_inicio).toLocaleDateString()}</span>
                        </div>
                        <div className="itinerary-item">
                            <span className="label">Fecha Regreso</span>
                            <span className="value"><Calendar size={16}/> {new Date(pkg.fecha_fin).toLocaleDateString()}</span>
                        </div>
                        <div className="itinerary-item">
                            <span className="label">Duración</span>
                            <span className="value"><Clock size={16}/> {pkg.tiempo_estadia} días</span>
                        </div>
                        <div className="itinerary-item">
                            <span className="label">Hospedaje</span>
                            <span className="value"><Star size={16} fill="#f59e0b" color="#f59e0b"/> {pkg.hotel_estrellas} Estrellas</span>
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <h3>Servicios del Hotel ({pkg.hotel_nombre})</h3>
                    <div className="services-list">
                        <div className="service-item"><Wifi size={18}/> Wifi Gratis</div>
                        <div className="service-item"><Coffee size={18}/> Desayuno Incluido</div>
                        <div className="service-item"><CheckCircle size={18}/> Habitaciones Sanitizadas</div>
                        <div className="service-item"><User size={18}/> Atención Personalizada</div>
                    </div>
                </div>
            </div>

            {/* Reserva Derecha */}
            <div className="booking-column">
                <div className="booking-card">
                    <div className="booking-header">
                        <span className="price-large">${Number(pkg.precio).toLocaleString()}</span>
                        <span className="price-unit"> MXN</span>
                    </div>
                    
                    <div className="summary-list">
                        <div className="summary-item">
                            <span>Transporte</span>
                            <strong>{pkg.transporte}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Hotel</span>
                            <strong>{pkg.hotel_nombre}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Estadía</span>
                            <strong>{pkg.tiempo_estadia} días / {pkg.tiempo_estadia - 1} noches</strong>
                        </div>
                    </div>

                    <div className="divider"></div>
                    
                    <div className="total-section">
                        <span>Total a pagar</span>
                        <span className="total-amount">${Number(pkg.precio).toLocaleString()}</span>
                    </div>

                    <button className="btn-book-full" onClick={handleReserveClick}>
                        Reservar Paquete
                    </button>
                    <p className="charge-notice">Reserva segura. Confirmación inmediata.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Alertas Modales */}
      {alertState.isOpen && (
          <div className="alert-overlay" onClick={closeAlert}>
            <div className="alert-modal" onClick={e => e.stopPropagation()}>
              <button className="alert-close" onClick={closeAlert}><X size={20}/></button>
              <div className={`alert-icon-wrapper ${alertState.type}`}>
                {alertState.type === 'confirm' && <LogIn size={32} />}
              </div>
              <h3 className="alert-title">{alertState.title}</h3>
              <p className="alert-message">{alertState.message}</p>
              <div className="alert-actions">
                {alertState.type === 'confirm' && (
                  <>
                    <button className="btn-cancel" onClick={closeAlert}>Cancelar</button>
                    <button className="btn-confirm" onClick={() => {
                      if (alertState.onConfirm) alertState.onConfirm();
                      closeAlert();
                    }}>Ir al Login</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      <style>{`
        .package-page { background: #f3f4f6; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; padding-bottom: 4rem; }
        .loading-screen, .error-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #2563eb; gap: 1rem; }
        .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* NAV */
        .nav-bar { background: white; position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0; }
        .nav-content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-title { font-weight: 600; color: #1f2937; display: none; }
        @media(min-width: 768px) { .nav-title { display: block; } }
        .btn-back { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; color: #4b5563; font-weight: 500; }
        .btn-back:hover { color: #2563eb; }
        .btn-book-sm { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; borderRadius: 6px; font-weight: 600; cursor: pointer; }

        /* MAIN */
        .main-container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

        /* HEADER */
        .pkg-header { margin: 2rem 0; display: flex; justify-content: space-between; align-items: flex-end; }
        .pkg-title { font-size: 2.5rem; font-weight: 800; color: #1f2937; margin: 0.5rem 0; line-height: 1.1; }
        .pkg-subtitle { color: #6b7280; font-size: 1.1rem; margin: 0; display: flex; align-items: center; gap: 6px; }
        
        .badges { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
        .badge-transport { display: flex; align-items: center; gap: 6px; color: white; font-weight: 600; background: linear-gradient(135deg, #f59e0b, #d97706); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; }
        .badge-hotel { display: flex; align-items: center; gap: 6px; color: #2563eb; font-weight: 600; background: #eff6ff; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; }

        .header-price { text-align: right; }
        .price-label { display: block; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; }
        .price-amount { font-size: 2.5rem; font-weight: 800; color: #1f2937; }

        /* GALLERY */
        .gallery-section { margin-bottom: 3rem; }
        .main-image-container { width: 100%; height: 450px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background: #e5e7eb; }
        .main-image { width: 100%; height: 100%; object-fit: cover; }
        .thumbnails { display: flex; gap: 1rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .thumb-btn { width: 100px; height: 70px; flex-shrink: 0; border: 2px solid transparent; border-radius: 8px; overflow: hidden; cursor: pointer; padding: 0; transition: all 0.2s; }
        .thumb-btn.active { border-color: #2563eb; transform: scale(1.05); }
        .thumb-btn img { width: 100%; height: 100%; object-fit: cover; }

        /* GRID */
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media(min-width: 900px) { .content-grid { grid-template-columns: 2fr 1fr; } }

        /* CARDS */
        .section-card { background: white; padding: 2rem; border-radius: 16px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .highlight-card { border-left: 5px solid #f59e0b; }
        .section-card h3 { margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #1f2937; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .description-text { color: #4b5563; line-height: 1.8; font-size: 1.05rem; }

        .itinerary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; background: #fffbeb; padding: 1.5rem; border-radius: 12px; }
        .itinerary-item { display: flex; flex-direction: column; gap: 4px; }
        .itinerary-item .label { font-size: 0.8rem; color: #92400e; font-weight: 600; text-transform: uppercase; }
        .itinerary-item .value { font-weight: 700; color: #451a03; display: flex; align-items: center; gap: 6px; font-size: 1.1rem; }

        .services-list { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .service-item { display: flex; align-items: center; gap: 10px; color: #4b5563; font-weight: 500; }

        /* BOOKING CARD */
        .booking-column { position: relative; }
        .booking-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: sticky; top: 100px; border: 1px solid #e5e7eb; }
        .booking-header { margin-bottom: 1.5rem; display: flex; align-items: baseline; gap: 4px; border-bottom: 1px solid #f3f4f6; padding-bottom: 1rem; }
        .price-large { font-size: 2rem; font-weight: 800; color: #1f2937; }
        .price-unit { color: #6b7280; font-weight: 500; }

        .summary-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .summary-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
        .summary-item span { color: #6b7280; }
        .summary-item strong { color: #1f2937; }

        .divider { border-top: 1px dashed #e5e7eb; margin: 1rem 0; }
        .total-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 1.2rem; font-weight: 700; color: #1f2937; }
        .total-amount { color: #2563eb; }

        .btn-book-full { width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 1rem; border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: transform 0.1s, box-shadow 0.2s; }
        .btn-book-full:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3); }
        .charge-notice { text-align: center; color: #6b7280; font-size: 0.85rem; margin-top: 1rem; display: block; }

        /* ALERT STYLES */
        .alert-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease-out; }
        .alert-modal { background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px; text-align: center; position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease-out; }
        .alert-close { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #9ca3af; cursor: pointer; padding: 5px; }
        .alert-icon-wrapper { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; }
        .alert-icon-wrapper.confirm { background: #e0e7ff; color: #4f46e5; }
        .alert-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
        .alert-message { color: #6b7280; margin-bottom: 2rem; line-height: 1.5; }
        .alert-actions { display: flex; gap: 10px; }
        .btn-confirm { flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-cancel { flex: 1; background: white; border: 1px solid #e5e7eb; color: #374151; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PackageDetails;