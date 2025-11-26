import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Wifi, Coffee, Utensils, Car, Wind, Tv, CheckCircle, AlertCircle } from 'lucide-react';

// URL Base correcta
const API_BASE = 'http://localhost:3000/agenciaViajes';

// Imágenes por defecto para rotar si no hay imagen en BD
const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1000"
];

// Descripciones por defecto para rotar si no hay descripción en BD
const DEFAULT_DESCRIPTIONS = [
    "Experimenta el lujo y la comodidad en el corazón de la ciudad. Nuestras habitaciones recién renovadas ofrecen vistas panorámicas y tecnología de vanguardia para garantizar tu descanso.",
    "Un refugio tranquilo lejos del bullicio. Disfruta de nuestros jardines tropicales, spa de clase mundial y una gastronomía que deleitará tus sentidos en cada comida.",
    "Ideal para viajeros de negocios y placer. Ubicación estratégica cerca de los principales centros financieros y turísticos, con espacios de coworking y gimnasio 24 horas.",
    "Descubre la arquitectura colonial fusionada con el confort moderno. Cada rincón cuenta una historia, ofreciendo una atmósfera cálida y un servicio personalizado que te hará sentir en casa.",
    "Resort exclusivo frente al mar con acceso privado a la playa. Actividades acuáticas, clubes para niños y suites espaciosas diseñadas para las vacaciones familiares perfectas."
];

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHotelData();
  }, [id]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      // ESTRATEGIA: Traemos todos y filtramos en el cliente.
      const response = await fetch(`${API_BASE}/hoteles/mostrarTodosHoteles`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await response.json();
      
      // Buscamos el hotel específico por ID
      const hotelEncontrado = data.find(h => h.id.toString() === id.toString());

      if (hotelEncontrado) {
        setHotel(hotelEncontrado);
      } else {
        setError("No se encontró el hotel especificado.");
      }

    } catch (error) {
      console.error('Error:', error);
      setError("Error al cargar la información del hotel.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener imagen por defecto basada en el ID
  const getFallbackImage = (hotelId) => {
    if (!hotelId) return DEFAULT_IMAGES[0];
    const index = parseInt(hotelId) % DEFAULT_IMAGES.length;
    return DEFAULT_IMAGES[index];
  };

  // Función para obtener descripción por defecto basada en el ID
  const getFallbackDescription = (hotelId) => {
    if (!hotelId) return DEFAULT_DESCRIPTIONS[0];
    const index = parseInt(hotelId) % DEFAULT_DESCRIPTIONS.length;
    return DEFAULT_DESCRIPTIONS[index];
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ fontSize: '1.2rem', color: '#374151' }}>Cargando información...</div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', gap: '20px' }}>
        <AlertCircle size={48} color="#dc2626" />
        <h2 style={{ color: '#1f2937' }}>{error || 'Hotel no encontrado'}</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Volver al inicio
        </button>
      </div>
    );
  }

  const fallbackImg = getFallbackImage(hotel.id);
  const description = hotel.descripcion || getFallbackDescription(hotel.id);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'white',
          color: '#374151',
          border: '1px solid #e5e7eb',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontWeight: '500',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <ArrowLeft size={20} />
        Volver
      </button>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>{hotel.nombre}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#4b5563' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={20} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ fontWeight: '600', color: '#111827' }}>{hotel.estrellas || '5'} Estrellas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={18} />
                    <span>{hotel.direccion}</span>
                </div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                 <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>Precio por noche</span>
                 <span style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>
                    ${hotel.precio ? Number(hotel.precio).toLocaleString('es-MX') : 'Consultar'}
                 </span>
            </div>
        </div>

        {/* Imagen con fallback dinámico */}
        <div style={{ width: '100%', height: '400px', backgroundColor: '#e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
            <img 
            src={hotel.imagen || fallbackImg} 
            alt={hotel.nombre}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg }} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Descripción</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
              {description}
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#111827' }}>Servicios incluidos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Wifi size={18} color="#2563eb"/> Wi-Fi Gratuito</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Coffee size={18} color="#2563eb"/> Desayuno Buffet</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Utensils size={18} color="#2563eb"/> Restaurante</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Car size={18} color="#2563eb"/> Estacionamiento</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Wind size={18} color="#2563eb"/> Aire Acondicionado</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}><Tv size={18} color="#2563eb"/> TV Satelital</div>
            </div>
          </div>

          <div style={{ background: '#f3f4f6', padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Contacto y Reservas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Teléfono:</span>
                    <span style={{ fontWeight: '500' }}>{hotel.telefono}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Ciudad:</span>
                    <span style={{ fontWeight: '500' }}>ID: {hotel.ciudad_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Estado:</span>
                    <span style={{ fontWeight: '500', color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={16} /> Disponible
                    </span>
                </div>
            </div>

            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onClick={() => alert('Funcionalidad de reserva próximamente')}
            >
              Reservar ahora
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>
                Sin cargos ocultos. Cancelación gratuita hasta 24h antes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;