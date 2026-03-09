import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Clock} from "lucide-react";

//importamos hook
import { useLoading } from "../context/LoadingContext";
import hotelService from "../services/hotelService";

//importamos el componente de reserva
import Reservation from "../components/Reservations";

// IMPORTAMOS EL NUEVO CSS
import "../styles/HotelDetails.css";


const HotelDetails = () => {
  const { id } = useParams();
  const { showLoading, hideLoading } = useLoading();

  const [hotelDetails, setHotelDetais] = useState([]);
  const [hotelImages,  setHotelImages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const loadData = async () => {
    try {
      showLoading("Cargando datos...")
      const [hotelDetailsData, hotelImagesData] = await Promise.all([
        hotelService.getDetailsHotelID(id),
        hotelService.getImageHotel(id).catch((error) => {
          return [];
        }),
      ]);
      setHotelDetais(hotelDetailsData);
      setHotelImages(hotelImagesData);
    } catch (error) {
      setHotelDetais([]);
      setHotelImages([]);
    }finally{
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
        
        <header className="hd-hotel-header">
          <div className="hd-header-info">
            <div className="hd-badges">
              <span className="hd-badge-stars">
                <Star size={14} fill="currentColor" /> {hotelDetails?.estrellas?.toString() || "5"} Estrellas
              </span>
              <span className="hd-badge-city">
                <MapPin size={14} /> {hotelDetails?.nombre_ciudad || "GDL-MX"}
              </span>
            </div>
            <h1 className="hd-hotel-title">{hotelDetails?.nombre_hotel || "Cargando..."}</h1>
            <p className="hd-hotel-address">{hotelDetails?.direccion || "Cargando dirección..."}</p>
          </div>
          <div className="hd-header-price">
            <span className="hd-price-label">Precio por noche desde</span>
            <span className="hd-price-amount">
              {/* CORREGIDO: ?. antes del toString() */}
              ${hotelDetails?.precio_noche?.toString() || "0"}
            </span>
          </div>
        </header>

        <section className="hd-gallery-section">
          <div className="hd-main-image-container">
            <img
              src={selectedImage || "https://via.placeholder.com/1200x600?text=Sin+Imagen"}
              alt="Vista principal"
              className="hd-main-image"
              onError={(e) => (e.target.src = "https://via.placeholder.com/1200x600?text=Imagen+No+Disponible")}
            />
          </div>
          {hotelImages.length > 1 && (
            <div className="hd-thumbnails">
              {hotelImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`hd-thumb-btn ${selectedImage === img.url ? "active" : ""}`}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={`Vista ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </section>

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
                <div className="hd-policy-item">
                  <Clock size={22} className="hd-policy-icon" />
                  <div>
                    <strong>Check-in</strong>
                    <p>{hotelDetails?.check_in || "Consultar"}</p>
                  </div>
                </div>
                <div className="hd-policy-item">
                  <Clock size={22} className="hd-policy-icon" />
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

          {/* Reserva Sticky (Derecha) */}
            <Reservation details={hotelDetails}/>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;