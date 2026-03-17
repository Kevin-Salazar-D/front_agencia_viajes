import React from "react";
import { Link } from "react-router-dom";

import icons from "../constants/icons";
import "../styles/PackageCard.css";

const PackageCard = ({ packageData }) => {
  const precio = packageData.precio || 999;

  const fechaInicio = new Date(packageData.fecha_inicio);
  const fechaFin = new Date(packageData.fecha_fin);
  const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
  const duracionFinal = packageData.tiempo_estadia || dias;

  return (
    <article className="pkg-card">
      {/* Imagen y Etiqueta Rosa */}
      <div className="pkg-card-image-wrapper">
        <img
          src={packageData.hotel_imagen}
          alt={`Hotel ${packageData.hotel_nombre || "Incluido"}`}
          loading="lazy"
          className="pkg-card-image"
        />
        <span className="pkg-card-badge">{packageData.tipo_paquete}</span>
      </div>

      <div className="pkg-card-content">
        {/* Título y Ubicación */}
        <header className="pkg-card-header">
          <h3>{packageData.hotel_nombre || "Hotel Incluido"}</h3>
          <p className="pkg-card-location">
            {/* CORRECCIÓN: Solo llaves, sin picos y sin size extra */}
            {icons.location}
            {packageData.ciudad}
          </p>
        </header>

        {/* Especificaciones: Alineadas a la izquierda con circulitos */}
        <div className="pkg-card-specs">
          <div className="pkg-spec-row">
            <div className="pkg-spec-icon-wrapper">{icons.bus}</div>
            <span className="pkg-spec-text">
              Transporte: {packageData.transporte}
            </span>
          </div>

          <div className="pkg-spec-row">
            <div className="pkg-spec-icon-wrapper">{icons.calendar}</div>
            <span className="pkg-spec-text">
              {duracionFinal} {duracionFinal === 1 ? "día" : "días"}
            </span>
          </div>

          <div className="pkg-spec-row">
            <div className="pkg-spec-icon-wrapper">{icons.location}</div>
            <span
              className="pkg-spec-text"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              Hotel{packageData.hotel_direccion}
            </span>
          </div>

          <div className="pkg-spec-row">
            <div className="pkg-spec-icon-wrapper">{icons.star}</div>
            <span
              className="pkg-spec-text"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              Calificacion de {packageData.hotel_estrellas}
            </span>
          </div>

          <div className="pkg-spec-row">
            <div className="pkg-spec-icon-wrapper">{icons.phone}</div>
            <span
              className="pkg-spec-text"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              Telefono {packageData.hotel_telefono}
            </span>
          </div>
        </div>

        {/* Footer: Precio y Botón Azul */}
        <div className="pkg-card-footer">
          <div className="pkg-price-container">
            <span className="pkg-price-label">Precio total</span>
            <span className="pkg-price-value">
              $
              {precio.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <Link
            to={`/paquete/${packageData.paquete_id}`}
            className="pkg-btn-details"
          >
            Ver detalles {icons.arrow}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PackageCard;
