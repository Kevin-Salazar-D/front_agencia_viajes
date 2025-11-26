// src/pages/HotelDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, ArrowLeft, Wifi, Coffee, Utensils, Car, Wind, Tv, CheckCircle, X } from 'lucide-react';
import { getHotelById } from '../services/hotels';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotelData();
  }, [id]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      const response = await getHotelById(id);
      setHotel(response.data); // Ajusta según tu estructura de respuesta
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!hotel) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Hotel no encontrado</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={20} />
        Volver
      </button>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>{hotel.nombre}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontWeight: '600' }}>{hotel.calificacion || '4.5'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} />
            <span>{hotel.direccion}</span>
          </div>
        </div>

        {hotel.imagen && (
          <img 
            src={hotel.imagen} 
            alt={hotel.nombre} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Descripción</h2>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {hotel.descripcion || 'Hotel de excelente calidad con todas las amenidades necesarias para una estancia confortable.'}
            </p>
          </div>

          <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Precio desde</span>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                ${hotel.precio ? hotel.precio.toLocaleString('es-MX') : '5,999'}
              </div>
            </div>
            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;