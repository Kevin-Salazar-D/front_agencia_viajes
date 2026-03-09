import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Info } from "lucide-react";
import { useAlert } from "../context/AlerContext"; // Asegúrate de que la ruta sea correcta

import '../styles/Reservation.css';

const Reservation = ({  details }) => {
  const navigate = useNavigate();
  const { error: globalError } = useAlert();

  
  const [dates, setDates] = useState({
    start: new Date().toISOString().split("T"),
    end: new Date(Date.now() + 86400000).toISOString().split("T"),
  });

  // 2. LOS CÁLCULOS AHORA VIVEN AQUÍ
  const calculations = useMemo(() => {
    if (!details) return { nights: 0, total: 0, price: 0 };
    const basePrice = Number(details?.precio_noche)  || 0;
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
  }, [dates , details]);

  const handleReserveClick = (e) => {
    e.preventDefault(); // Como ahora es un formulario, evitamos que recargue la página

    if (calculations.nights <= 0) {
      globalError("Fechas inválidas", "La fecha de salida debe ser posterior a la fecha de llegada.");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      globalError("Inicia sesión para continuar", "Necesitas una cuenta para poder realizar reservaciones.");
      navigate("/login");
      return;
    }

    // Redirigimos al pago con todos los datos necesarios
    navigate("/payment", {
      state: {
        details,
        dates,
        totalDays: calculations.nights,
        totalPrice: calculations.total,
      },
    });
  };

  return (
    <aside className="hd-booking-column" aria-labelledby="booking-title">
      <form className="hd-booking-card" onSubmit={handleReserveClick}>
        
        <header className="hd-booking-header">
          {/* Un h2 oculto visualmente pero útil para lectores de pantalla */}
          <h2 id="booking-title" style={{ display: 'none' }}>Reserva tu estancia</h2>
          <p style={{ margin: 0 }}>
            <span className="hd-price-large">${calculations.price.toLocaleString()}</span>
            <span className="hd-price-unit"> / noche</span>
          </p>
        </header>

        <fieldset className="hd-date-selector" style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
          <legend style={{ display: 'none' }}>Selecciona tus fechas de viaje</legend>
          <div className="hd-date-input-group">
            <label htmlFor="checkin-date">Llegada</label>
            <input
              id="checkin-date"
              type="date"
              value={dates.start}
              min={new Date().toISOString().split("T")}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              required
            />
          </div>
          <div className="hd-date-input-group">
            <label htmlFor="checkout-date">Salida</label>
            <input
              id="checkout-date"
              type="date"
              value={dates.end}
              min={dates.start}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              required
            />
          </div>
        </fieldset>

        {/* Usamos listas para agrupar datos relacionados */}
        <ul className="hd-booking-info" style={{ listStyle: 'none', padding: '1.25rem', margin: '0 0 1.5rem 0' }}>
          <li className="hd-info-row">
            <Phone size={16} aria-hidden="true" />
            <span>{details?.telefono || "Sin teléfono"}</span>
          </li>
          <li className="hd-info-row">
            <Info size={16} aria-hidden="true" />
            <span>{details?.retricciones || "Sin restricciones"}</span>
          </li>
        </ul>

        {/* El botón es de tipo submit porque está dentro de un form */}
        <button type="submit" className="hd-btn-book-full">
          Reservar Ahora
        </button>
        <p className="hd-charge-notice">No se te cobrará nada todavía</p>

        <section className="hd-total-preview" aria-label="Resumen de costos">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li className="hd-total-row">
              <span>Estancia ({calculations.nights} noches)</span>
              <span>${calculations.total.toLocaleString()}</span>
            </li>
            <li className="hd-total-row hd-total-final">
              <span>Total</span>
              <span>${calculations.total.toLocaleString()} MXN</span>
            </li>
          </ul>
        </section>

      </form>
    </aside>
  );
};

export default Reservation;