import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Info } from "lucide-react";

import { useAlert } from "@/context/AlerContext";
import { useModal } from "@/context/ModalConfirmContext";
import { useAuth } from "@/context/AuthContext";

import "../styles/Reservation.css";

const Reservation = ({ details }) => {
  const navigate = useNavigate();
  const { error: globalError } = useAlert();
  const { userAuth } = useAuth();
  const { showModal } = useModal();

  // Constante para no recalcular "hoy" en cada render
  const todayString = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [dates, setDates] = useState({
    start: todayString,
    end: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  // Cálculos reactivos de precio y noches
  const calculations = useMemo(() => {
    if (!details) return { nights: 0, total: 0, price: 0 };

    const basePrice = Number(details?.precio_noche) || 0;
    const start = new Date(dates.start);
    const end = new Date(dates.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { nights: 0, total: 0, price: basePrice };
    }

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si la fecha de salida es igual o antes que la de llegada, 0 noches
    const nights = diffDays > 0 ? diffDays : 0;
    const total = nights * basePrice;

    return { nights, total, price: basePrice };
  }, [dates, details]);

  const handleReserveClick = async (e) => {
    e.preventDefault();

    if (calculations.nights <= 0) {
      globalError(
        "Fechas inválidas",
        "La fecha de salida debe ser posterior a la fecha de llegada.",
      );
      return;
    }

    if (!userAuth) {
       // Llamamos al modal y esperamos su respuesta
       const isConfirm = await showModal({
         type: "warning",
         title: "¿No tienes cuenta?",
         message: "Crea una cuenta para reservar en este hotel y disfrutar de todas nuestras ofertas.",
         confirmText: "Sí, registrarme",
         cancelText: "No por el momento", 
         navigateRoute: "/crear-cuenta" 
       });
       
      
       if(!isConfirm) return;
       return; 
    }

  
    navigate("/payment", {
      state: {
        hotel: details,
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
          <h2 id="booking-title" style={{ display: "none" }}>
            Reserva tu estancia
          </h2>
          <p style={{ margin: 0 }}>
            <span className="hd-price-large">
              ${calculations.price.toLocaleString()}
            </span>
            <span className="hd-price-unit"> / noche</span>
          </p>
        </header>

        <fieldset className="hd-date-selector">
          <legend style={{ display: "none" }}>
            Selecciona tus fechas de viaje
          </legend>
          <div className="hd-date-grid">
            <div className="hd-date-input-group">
              <label htmlFor="checkin-date">Llegada</label>
              <input
                id="checkin-date"
                type="date"
                value={dates.start}
                min={todayString}
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
                min={dates.start} // La salida no puede ser antes de la llegada
                onChange={(e) => setDates({ ...dates, end: e.target.value })}
                required
              />
            </div>
          </div>
        </fieldset>

        <ul className="hd-booking-info">
          <li className="hd-info-row">
            <Phone size={16} aria-hidden="true" />
            <span>{details?.telefono || "Sin teléfono"}</span>
          </li>
          <li className="hd-info-row">
            <Info size={16} aria-hidden="true" />
            <span>{details?.retricciones || "Sin restricciones"}</span>
          </li>
        </ul>

        <button type="submit" className="hd-btn-book-full">
          Reservar Ahora
        </button>
        <p className="hd-charge-notice">No se te cobrará nada todavía</p>

        <section className="hd-total-preview" aria-label="Resumen de costos">
          <ul className="hd-total-list">
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
