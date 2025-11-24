import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, ArrowLeft, Wifi, Coffee, Utensils, Car, Wind, Tv, CheckCircle, X } from 'lucide-react';

// Simular datos del hotel (reemplaza con tu API real)
const getHotelById = async (id) => {
  // Aquí llamarías a tu API real
  // const response = await fetch(`/api/hotels/${id}`);
  // return response.json();
  
  // Datos de ejemplo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: id,
    nombre: "Hotel Paradise Beach Resort",
    direccion: "Av. Kukulcán Km 12.5, Zona Hotelera",
    ciudad: "Cancún",
    calificacion: 4.7,
    reviews: 342,
    precio: 5999,
    descripcion: "Disfruta de unas vacaciones inolvidables en nuestro resort de 5 estrellas frente al mar. Contamos con amplias habitaciones, restaurantes gourmet, spa de clase mundial y acceso directo a una de las playas más hermosas del Caribe mexicano.",
    imagenes: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
    ],
    amenidades: [
      { icon: Wifi, nombre: "WiFi gratis" },
      { icon: Coffee, nombre: "Desayuno incluido" },
      { icon: Utensils, nombre: "Restaurante" },
      { icon: Car, nombre: "Estacionamiento" },
      { icon: Wind, nombre: "Aire acondicionado" },
      { icon: Tv, nombre: "TV por cable" }
    ],
    servicios: [
      "Piscina al aire libre",
      "Spa y centro de bienestar",
      "Gimnasio 24/7",
      "Bar en la playa",
      "Servicio a la habitación",
      "Recepción 24 horas",
      "Actividades acuáticas",
      "Club infantil"
    ],
    politicas: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancelacion: "Cancelación gratuita hasta 48 horas antes del check-in",
      mascotas: "No se permiten mascotas"
    }
  };
};

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadHotelData();
  }, [id]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      const data = await getHotelById(id);
      setHotel(data);
    } catch (error) {
      console.error('Error cargando hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Hotel no encontrado</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#eff6ff'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.5rem',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '400px'
        }}>
          <div 
            style={{ 
              gridColumn: 'span 2',
              gridRow: 'span 2',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => { setSelectedImage(0); setShowImageModal(true); }}
          >
            <img 
              src={hotel.imagenes[0]} 
              alt={hotel.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {hotel.imagenes.slice(1, 5).map((img, idx) => (
            <div 
              key={idx}
              style={{ 
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => { setSelectedImage(idx + 1); setShowImageModal(true); }}
            >
              <img 
                src={img} 
                alt={`${hotel.nombre} ${idx + 2}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {idx === 3 && hotel.imagenes.length > 5 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  +{hotel.imagenes.length - 5}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Columna izquierda */}
          <div>
            {/* Info básica */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                {hotel.nombre}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={20} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{hotel.calificacion}</span>
                  <span style={{ color: '#6b7280' }}>({hotel.reviews} reseñas)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <MapPin size={18} />
                  <span>{hotel.direccion}</span>
                </div>
              </div>
              
              <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1rem' }}>
                {hotel.descripcion}
              </p>
            </div>

            {/* Amenidades */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>
                Amenidades
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {hotel.amenidades.map((amenidad, idx) => {
                  const Icon = amenidad.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#eff6ff', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6'
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ color: '#374151', fontWeight: '500' }}>{amenidad.nombre}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Servicios */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>
                Servicios incluidos
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {hotel.servicios.map((servicio, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="#10b981" />
                    <span style={{ color: '#374151' }}>{servicio}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Políticas */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>
                Políticas del hotel
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong>Check-in:</strong> {hotel.politicas.checkIn}
                </div>
                <div>
                  <strong>Check-out:</strong> {hotel.politicas.checkOut}
                </div>
                <div>
                  <strong>Cancelación:</strong> {hotel.politicas.cancelacion}
                </div>
                <div>
                  <strong>Mascotas:</strong> {hotel.politicas.mascotas}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Card de reserva */}
          <div>
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '2rem',
              border: '1px solid #e5e7eb',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Precio por noche desde
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827' }}>
                  ${hotel.precio.toLocaleString('es-MX')}
                </div>
              </div>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Reservar ahora
              </button>

              <div style={{ 
                padding: '1rem', 
                background: '#f9fafb', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                  ✓ Reserva sin cargos adicionales<br />
                  ✓ Confirmación instantánea<br />
                  ✓ Cancela sin costo hasta 48hrs antes
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <Phone size={18} />
                  <span>+52 33 1234 5678</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <Mail size={18} />
                  <span>reservas@hotel.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {showImageModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={hotel.imagenes[selectedImage]} 
            alt={hotel.nombre}
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HotelDetails;