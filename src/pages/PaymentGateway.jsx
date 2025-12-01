import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";

// Importar diseño
import "../styles/PaymentGatewayStyle.css";

const API_BASE = "http://localhost:3000/agenciaViajes";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};
  const { hotel, details, dates, totalDays, totalPrice} = bookingData;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("review"); // 'review', 'processing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (!hotel) {
      navigate("/");
      return;
    }
    console.log(hotel,"45")
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert("Debes iniciar sesión para continuar.");
      navigate("/login");
      return;
    }

    fetchRoomForHotel();
  }, [hotel, navigate]);

  const fetchRoomForHotel = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/habitaciones/mostrarTodasHabitaciones`
      );
      if (response.ok) {
        const allRooms = await response.json();
        const hotelRooms = allRooms.filter((r) => r.hotel_id === hotel.id);
        setRooms(hotelRooms);

        if (hotelRooms.length === 0) {
          setErrorMsg(
            "Lo sentimos, no hay habitaciones configuradas para este hotel en este momento."
          );
          setStep("error");
        }
      }
    } catch (err) {
      console.error("Error buscando habitación:", err);
      setErrorMsg("Ocurrió un error al obtener las habitaciones.");
      setStep("error");
    }
  };

  // Función para simular un pequeño delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePayment = async (e) => {
    e.preventDefault();

    // --- VALIDACIONES ---
    if (!roomId) {
      setErrorMsg("Debes seleccionar una habitación.");
      setStep("error");
      return;
    }

    if (!card.name.trim()) {
      setErrorMsg("El nombre del titular es obligatorio.");
      setStep("error");
      return;
    }

    if (!/^\d{16}$/.test(card.number)) {
      setErrorMsg("El número de tarjeta debe tener 16 dígitos.");
      setStep("error");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
      setErrorMsg("La fecha de expiración debe tener formato MM/AA.");
      setStep("error");
      return;
    }

    if (!/^\d{3,4}$/.test(card.cvv)) {
      setErrorMsg("El CVV debe tener 3 o 4 dígitos.");
      setStep("error");
      return;
    }

    // --- PROCESO DE PAGO ---
    setLoading(true);
    setErrorMsg("");
    setStep("processing");

    try {
      // --- CREAR RESERVACION ---
      const reservaBody = {
        usuario_id: user.id,
        habitacion_id: roomId,
        paquete_id: hotel?.paquete_id || null,
        fecha_entrada: dates.start,
        fecha_salida: dates.end,
        estatus: 0, // Pendiente
      };

      const resReservacion = await fetch(
        `${API_BASE}/reservaciones/crearReservacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservaBody),
        }
      );

      if (!resReservacion.ok) {
        const errData = await resReservacion.json();
        throw new Error(errData.error || "Error al crear la reservación");
      }

      const dataReserva = await resReservacion.json();
      if (!dataReserva) throw new Error("No se recibió el ID de la reserva");

      // --- ESPERAR UN SEGUNDO PARA SIMULAR PROCESO ---
      await delay(1000);

      // --- CREAR PAGO ---
      const pagoBody = {
        usuario_id: user.id,
        reservacion_id: dataReserva.resultado,
        paquete_id: null,
        precio_final: totalPrice,
        folio: `PAY-${Date.now()}`,
        numero_tarjeta: card.number,
        cvv: card.cvv,
        estatus: 1, // Pago exitoso
      };

      const resPago = await fetch(`${API_BASE}/pagos/crearPago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoBody),
      });

      if (!resPago.ok) {
        const errData = await resPago.json();
        // Opcional: borrar la reserva si el pago falla
        await fetch(`${API_BASE}/reservaciones/borrarReservacion`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numero_reserva: dataReserva.numero_reserva }),
        });
        throw new Error(errData.error || "El pago fue rechazado");
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error durante el proceso.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) return null;
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
            <ArrowLeft size={20} /> Cancelar
          </button>
          <div className="secure-badge">
            <Lock size={16} /> Pasarela Segura
          </div>
        </div>
      </header>

      <div className="payment-grid">
        <div className="summary-section">
          <div className="summary-card">
            <h3>Resumen de tu Reserva</h3>
            <div className="hotel-mini-info">
              <img
                src={hotel.imagen}
                alt={hotel.nombre}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/100")
                }
              />
              <div>
                <h4>{hotel.nombre}</h4>
                <p className="location">
                  <MapPin size={14} /> {hotel.direccion}
                </p>
                <div className="stars">{"★".repeat(hotel.estrellas)}</div>
              </div>
            </div>
            <div className="pricing-details">
              <div className="price-row">
                <span className="row-label">
                  <Calendar size={16} /> Check-in
                </span>
                <span className="row-value">{dates?.start}</span>
              </div>
              <div className="price-row">
                <span className="row-label">
                  <Calendar size={16} /> Check-out
                </span>
                <span className="row-value">{dates?.end}</span>
              </div>
              <div className="price-row">
                <span className="row-label">Duración</span>
                <span className="row-value">{totalDays} noches</span>
              </div>
              <div className="divider"></div>
              <div className="price-row">
                <span className="row-label">Precio x noche</span>
                <span className="row-value">
                  ${(details?.precio_noche || 0).toLocaleString()}
                </span>
              </div>
              <div className="price-row total">
                <span>Total a Pagar</span>
                <span className="total-amount">
                  ${totalPrice?.toLocaleString()} MXN
                </span>
              </div>
            </div>
          </div>
          <div className="trust-badges">
            <div className="trust-item">✓ Cancelación gratuita 24h antes</div>
            <div className="trust-item">✓ Mejor precio garantizado</div>
            <div className="trust-item">✓ Soporte 24/7</div>
          </div>
        </div>

        <div className="form-section">
          {step === "error" && (
            <div className="error-banner">
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <AlertCircle size={20} />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setStep("review")} className="retry-btn">
                Reintentar
              </button>
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
              <label>Selecciona Habitación</label>
              <select
                required
                value={roomId || ""}
                onChange={(e) => setRoomId(parseInt(e.target.value))}
              >
                <option value="" disabled>
                  -- Selecciona una habitación --
                </option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.numero_habitacion && r.tipo_habitacion
                      ? `Habitación ${r.numero_habitacion} - ${r.tipo_habitacion}`
                      : `Habitación ${r.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Titular de la tarjeta</label>
              <input
                required
                type="text"
                placeholder="Nombre como aparece en la tarjeta"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
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
                  maxLength="16"
                  value={card.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
                    setCard({ ...card, number: val });
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
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
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
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="pay-button"
              disabled={loading || !roomId}
            >
              {loading ? (
                <span className="loading-text">
                  <Loader size={20} className="spinner" /> Procesando...
                </span>
              ) : (
                `Pagar $${totalPrice?.toLocaleString()}`
              )}
            </button>

            <p className="secure-footer">
              <Lock size={12} />
              <span>
                Tus datos se procesan con encriptación SSL de 256 bits.
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
