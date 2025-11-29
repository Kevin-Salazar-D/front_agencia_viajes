import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Calendar, MapPin, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Datos recibidos de la pantalla anterior
  const bookingData = location.state || {};
  const { hotel, details, dates, totalDays, totalPrice } = bookingData;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // 'review', 'processing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [roomId, setRoomId] = useState(null); // ID de la habitación a reservar

  // Datos del formulario de pago
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    // 1. Validación de datos de entrada
    if (!hotel) {
      navigate('/');
      return;
    }

    // 2. Validación de Usuario
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert('Debes iniciar sesión para continuar.');
      navigate('/login');
      return;
    }

    // 3. Obtener una habitación válida para este hotel
    // (En un flujo real, el usuario elegiría el tipo de habitación antes, aquí asignamos una disponible)
    fetchRoomForHotel();

  }, [hotel, navigate]);

  const fetchRoomForHotel = async () => {
    try {
      // Buscamos todas las habitaciones
      const response = await fetch(`${API_BASE}/habitaciones/mostrarTodasHabitaciones`);
      if (response.ok) {
        const rooms = await response.json();
        // Filtramos por el hotel actual
        const hotelRooms = rooms.filter(r => r.hotel_id === hotel.id);
        
        if (hotelRooms.length > 0) {
          // Tomamos la primera habitación encontrada (idealmente filtrarías por 'disponible')
          setRoomId(hotelRooms[0].id);
        } else {
          setErrorMsg('Lo sentimos, no hay habitaciones configuradas para este hotel en este momento.');
          setStep('error');
        }
      }
    } catch (err) {
      console.error("Error buscando habitación:", err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!roomId) {
      setErrorMsg('No se pudo asignar una habitación. Intenta con otro hotel.');
      setStep('error');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setStep('processing');

    try {
      // PASO 1: Crear la Reservación (Estado: Pendiente = 0)
      const reservaBody = {
        usuario_id: user.id,
        habitacion_id: roomId, 
        paquete_id: null, 
        fecha_entrada: dates.start,
        fecha_salida: dates.end,
        estatus: 0 // 0 = Pendiente
      };

      console.log("Enviando reserva:", reservaBody);

      const resReservacion = await fetch(`${API_BASE}/reservaciones/crearReservacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaBody)
      });

      if (!resReservacion.ok) {
        const errData = await resReservacion.json();
        throw new Error(errData.error || 'Error al crear la reservación');
      }

      const dataReserva = await resReservacion.json();
      // El backend puede devolver el ID en diferentes propiedades según la implementación exacta
      const reservaId = dataReserva.insertId || (dataReserva.resultado && dataReserva.resultado.insertId) || dataReserva.id;

      if (!reservaId) throw new Error('No se recibió el ID de la reserva');

      // PASO 2: Registrar el Pago (Estado: Pagado = 1)
      const pagoBody = {
        usuario_id: user.id,
        reservacion_id: reservaId,
        paquete_id: null,
        precio_final: totalPrice,
        folio: `PAY-${Date.now()}`,
        numero_tarjeta: card.number,
        cvv: card.cvv,
        estatus: 1
      };

      const resPago = await fetch(`${API_BASE}/pagos/crearPago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoBody)
      });

      if (!resPago.ok) {
        const errData = await resPago.json();
        throw new Error(errData.error || 'El pago fue rechazado');
      }

      // PASO 3: (Opcional) Actualizar estado de reserva a Confirmada (1)
      // Dependiendo de tu lógica de negocio, podrías hacer un PUT aquí a /reservaciones
      
      setStep('success');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error durante el proceso.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional si no hay datos
  if (!hotel) return null;

  // VISTA DE ÉXITO
  if (step === 'success') {
    return (
      <div className="payment-page success-view">
        <div className="success-card">
            <div className="icon-circle">
                <CheckCircle size={64} color="#10b981" />
            </div>
            <h1>¡Reserva Confirmada!</h1>
            <p className="success-msg">Tu pago ha sido procesado exitosamente.</p>
            
            <div className="confirmation-details">
                <p>Hotel: <strong>{hotel.nombre}</strong></p>
                <p>Fechas: {dates.start} al {dates.end}</p>
                <p className="total-paid">Total Pagado: ${totalPrice.toLocaleString()}</p>
            </div>

            <button onClick={() => navigate('/')} className="btn-primary">
                Volver al Inicio
            </button>
        </div>
        
        <style>{`
          .payment-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; font-family: system-ui, sans-serif; }
          .success-card { background: white; padding: 3rem; border-radius: 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
          .icon-circle { background: #ecfdf5; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
          h1 { color: #1f2937; margin-bottom: 0.5rem; font-size: 1.8rem; }
          .success-msg { color: #6b7280; margin-bottom: 2rem; }
          .confirmation-details { background: #f9fafb; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; text-align: left; }
          .confirmation-details p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
          .total-paid { color: #2563eb !important; font-weight: 700; font-size: 1.1rem; margin-top: 1rem !important; border-top: 1px dashed #e5e7eb; padding-top: 0.5rem; }
          .btn-primary { background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
          .btn-primary:hover { background: #1d4ed8; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <header className="payment-header">
        <div className="header-content">
            <button onClick={() => navigate(-1)} className="back-link">
                <ArrowLeft size={20}/> Cancelar
            </button>
            <div className="secure-badge">
                <Lock size={16} /> Pasarela Segura
            </div>
        </div>
      </header>

      <div className="payment-grid">
        {/* Resumen de Compra */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Resumen de tu Reserva</h3>
            
            <div className="hotel-mini-info">
              <img 
                src={hotel.imagen} 
                alt={hotel.nombre} 
                onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
              />
              <div>
                  <h4>{hotel.nombre}</h4>
                  <p className="location"><MapPin size={14}/> {hotel.direccion}</p>
                  <div className="stars">{'★'.repeat(hotel.estrellas)}</div>
              </div>
            </div>
            
            <div className="pricing-details">
              <div className="price-row">
                  <span className="row-label"><Calendar size={16}/> Check-in</span>
                  <span className="row-value">{dates?.start}</span>
              </div>
              <div className="price-row">
                  <span className="row-label"><Calendar size={16}/> Check-out</span>
                  <span className="row-value">{dates?.end}</span>
              </div>
              <div className="price-row">
                  <span className="row-label">Duración</span>
                  <span className="row-value">{totalDays} noches</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="price-row">
                  <span className="row-label">Precio x noche</span>
                  <span className="row-value">${(details?.precio_noche || 0).toLocaleString()}</span>
              </div>
              <div className="price-row total">
                  <span>Total a Pagar</span>
                  <span className="total-amount">${totalPrice?.toLocaleString()} MXN</span>
              </div>
            </div>
          </div>
          
          <div className="trust-badges">
            <div className="trust-item">✓ Cancelación gratuita 24h antes</div>
            <div className="trust-item">✓ Mejor precio garantizado</div>
            <div className="trust-item">✓ Soporte 24/7</div>
          </div>
        </div>

        {/* Formulario de Pago */}
        <div className="form-section">
            {step === 'error' && (
                <div className="error-banner">
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        <AlertCircle size={20}/> 
                        <span>{errorMsg}</span>
                    </div>
                    <button onClick={() => setStep('review')} className="retry-btn">Reintentar</button>
                </div>
            )}

            <form onSubmit={handlePayment} className="payment-form">
                <div className="form-header">
                    <h3>Método de Pago</h3>
                    <div className="card-icons">
                        <div className="card-icon">Visa</div>
                        <div className="card-icon">MC</div>
                        <div className="card-icon">Amex</div>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Titular de la tarjeta</label>
                    <input 
                        required 
                        type="text"
                        placeholder="Nombre como aparece en la tarjeta"
                        value={card.name}
                        onChange={e => setCard({...card, name: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Número de tarjeta</label>
                    <div className="input-icon-wrap">
                        <CreditCard size={20} className="field-icon" />
                        <input 
                            required 
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            value={card.number}
                            onChange={e => {
                                // Formato simple de tarjeta
                                const val = e.target.value.replace(/\D/g, '').substring(0,16);
                                setCard({...card, number: val});
                            }}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Expiración</label>
                        <input 
                            required 
                            type="text"
                            placeholder="MM/AA"
                            maxLength="5"
                            value={card.expiry}
                            onChange={e => setCard({...card, expiry: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>CVV / CVC</label>
                        <div className="input-icon-wrap">
                            <Lock size={18} className="field-icon" />
                            <input 
                                required 
                                type="password"
                                placeholder="123"
                                maxLength="4"
                                value={card.cvv}
                                onChange={e => setCard({...card, cvv: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="pay-button" disabled={loading || !roomId}>
                    {loading ? (
                        <span className="loading-text"><Loader size={20} className="spinner"/> Procesando...</span>
                    ) : (
                        `Pagar $${totalPrice?.toLocaleString()}`
                    )}
                </button>
                
                <p className="secure-footer">
                    <Lock size={12} /> 
                    <span>Tus datos se procesan con encriptación SSL de 256 bits.</span>
                </p>
            </form>
        </div>
      </div>

      <style>{`
        :root {
            --primary: #2563eb;
            --bg: #f3f4f6;
            --text: #1f2937;
        }

        .payment-container {
            min-height: 100vh;
            background: var(--bg);
            font-family: system-ui, -apple-system, sans-serif;
            color: var(--text);
        }

        .payment-header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .header-content {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .back-link {
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: color 0.2s;
        }
        .back-link:hover { color: var(--primary); }

        .secure-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #059669;
            background: #ecfdf5;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .payment-grid {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 0 1.5rem;
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 2rem;
            align-items: start;
        }

        /* Summary Styles */
        .summary-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .summary-card h3 { margin: 0 0 1.5rem 0; font-size: 1.1rem; }

        .hotel-mini-info { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .hotel-mini-info img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }
        .hotel-mini-info h4 { margin: 0 0 4px 0; font-size: 1rem; }
        .location { margin: 0 0 4px 0; color: #6b7280; font-size: 0.85rem; display: flex; alignItems: center; gap: 4px; }
        .stars { color: #f59e0b; font-size: 0.8rem; }

        .price-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.9rem; }
        .row-label { display: flex; align-items: center; gap: 6px; color: #6b7280; }
        .row-value { font-weight: 500; }
        
        .divider { border-top: 1px dashed #e5e7eb; margin: 1rem 0; }
        
        .total { margin-top: 0.5rem; font-size: 1.1rem; font-weight: 700; color: var(--text); }
        .total-amount { color: var(--primary); }

        .trust-badges { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .trust-item { font-size: 0.85rem; color: #4b5563; }

        /* Form Styles */
        .payment-form {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }

        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .form-header h3 { margin: 0; }
        .card-icons { display: flex; gap: 8px; }
        .card-icon { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; color: #6b7280; }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: #374151; }
        .form-group input {
            width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 1rem; box-sizing: border-box; transition: all 0.2s;
        }
        .form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

        .input-icon-wrap { position: relative; }
        .input-icon-wrap input { padding-left: 40px; }
        .field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .pay-button {
            width: 100%;
            padding: 16px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 1rem;
        }
        .pay-button:hover:not(:disabled) { background: #1d4ed8; }
        .pay-button:disabled { opacity: 0.7; cursor: not-allowed; }

        .loading-text { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .secure-footer { text-align: center; font-size: 0.8rem; color: #9ca3af; margin-top: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 6px; }

        .error-banner {
            background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;
        }
        .retry-btn { background: white; border: 1px solid #fca5a5; color: #991b1b; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }

        @media (max-width: 768px) {
            .payment-grid { grid-template-columns: 1fr; }
            .summary-section { order: -1; }
        }
      `}</style>
    </div>
  );
};

export default PaymentGateway;