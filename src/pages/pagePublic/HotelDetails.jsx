import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Importamos la palomita para las amenidades

// importamos hook
import { useLoading } from "@/context/LoadingContext";
import hotelService from "@/services/hotelService";

// importamos iconos
import icons from "@/constants/icons";

// importamos el componente de reserva
import Reservation from "@/components/Reservations";

// IMPORTAMOS EL NUEVO CSS
import "@/styles/HotelDetails.css";

// importamos el componente reutilizable
import SliderImages from "@/components/carousels/SliderImages";

const HotelDetails = () => {
  const { id } = useParams();
  const { showLoading, hideLoading } = useLoading();

  const [hotelDetails, setHotelDetais] = useState([]);
  const [hotelImages, setHotelImages] = useState([]);

  const loadData = async () => {
    try {
      showLoading("Cargando datos...");
      const [hotelDetailsData, hotelImagesData] = await Promise.all([
        hotelService.getDetailsHotelID(id),
        hotelService.getImageHotel(id).catch(() => {
          return [];
        }),
      ]);
      setHotelDetais(hotelDetailsData);
      setHotelImages(hotelImagesData);
    } catch (error) {
      setHotelDetais([]);
      setHotelImages([]);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [id]);

  return (
    <div className="hotel-details-page">
      <div className="hd-main-container">
        
        {/* ENCABEZADO: Título, ubicación y precio */}
        <header className="hd-hotel-header">
          <div className="hd-header-info">
            <div className="hd-badges">
              <span className="hd-badge-stars">
                {icons.star} {hotelDetails?.estrellas?.toString() || "5"} Estrellas
              </span>
              <span className="hd-badge-city">
                {icons.locationCard} {hotelDetails?.nombre_ciudad || "GDL-MX"}
              </span>
            </div>
            
            <h1 className="hd-hotel-title">
              {hotelDetails?.nombre_hotel || "Cargando..."}
            </h1>
            
            <p className="hd-hotel-address">
              {hotelDetails?.direccion || "Cargando dirección..."}
            </p>
          </div>
          
          <div className="hd-header-price">
            <span className="hd-price-label">Precio por noche desde</span>
            <span className="hd-price-amount">
              ${hotelDetails?.precio_noche?.toString() || "0"}
            </span>
          </div>
        </header>

        {/* =============== GALERÍA =============== */}
        {/* Eliminamos el div extra que causaba un doble margen gigante */}
        <SliderImages gallery={hotelImages} />

        <div className="hd-content-grid">
          {/* Detalles (Izquierda) */}
          <div className="hd-details-column">
            
            <div className="hd-section-card">
              <h3>Descripción</h3>
              <p className="hd-description-text">
                {hotelDetails?.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            <div className="hd-section-card">
              <h3>Lo que ofrece este lugar</h3>
              {hotelDetails?.amenidades?.length > 0 ? (
                <div className="hd-amenities-grid">
                  {hotelDetails.amenidades.map((item, idx) => (
                    <div key={idx} className="hd-amenity-item">
                      {/* Agregamos el icono de check azul para que se vea elegante */}
                      <CheckCircle size={18} className="hd-amenity-icon" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="hd-text-empty">Servicios no especificados.</p>
              )}
            </div>

            <div className="hd-section-card">
              <h3>Políticas y Horarios</h3>
              
              <div className="hd-policies-grid">
                {/* Corregimos las clases: el icono ahora está envuelto correctamente */}
                <div className="hd-policy-item">
                  <div className="hd-policy-icon">{icons.clock}</div>
                  <div>
                    <strong>Check-in</strong>
                    <p>{hotelDetails?.check_in || "Consultar"}</p>
                  </div>
                </div>
                <div className="hd-policy-item">
                  <div className="hd-policy-icon">{icons.clock}</div>
                  <div>
                    <strong>Check-out</strong>
                    <p>{hotelDetails?.check_out || "Consultar"}</p>
                  </div>
                </div>
              </div>

              {hotelDetails?.politicas?.length > 0 ? (
                <div className="hd-policy-text-block">
                  <strong>Políticas de alojamiento</strong>
                  {hotelDetails.politicas.map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </div>
              ) : (
                <p className="hd-text-empty">Políticas no especificadas.</p>
              )}
            </div>
            
          </div>

         
          <div className="hd-reservation-column">
            <Reservation details={hotelDetails} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelDetails;