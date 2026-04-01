import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAlert } from "@/context/AlerContext";
import { useLoading } from "@/context/LoadingContext";
import { useModal } from "@/context/ModalConfirmContext";
import { useAuth } from "@/context/AuthContext";

// Importamos los servicios
import packageService from "@/services/packageService";
import hotelService from "@/services/hotelService";

import icons from "@/constants/icons";
import "@/styles/PackageDeatails.css"; 

import SliderImages from "@/components/carousels/SliderImages";

const PackageDetails = () => {
  // Obtenemos la id de la url
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { error } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const { userAuth } = useAuth();
  const { showModal } = useModal();

  const [pkg, setPkg] = useState(null); 
  const [gallery, setGallery] = useState([]);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadigData();
  }, [id]);

  const loadigData = async () => {
    try {
      showLoading("Cargando los datos del paquete....");
      
      const packageResponse = await packageService.getPackageByid(id);
      setPkg(packageResponse);
      
      const packageHotelID = packageResponse?.hotel_id;

      if (!packageHotelID) {
        error(
          "Error",
          "No pudimos cargar la información del paquete seleccionado."
        );
        return;
      }

      const hotelDetails = await hotelService.getDetailsHotelID(packageHotelID);
      const amenitiesResponse = hotelDetails?.amenidades || [];
      
      const imagesData = await hotelService.getImageHotel(packageHotelID);
      const safeImagesData = Array.isArray(imagesData) ? imagesData : [];

      const fullGallery = packageResponse.hotel_imagen
        ? [{ id: "main", url: packageResponse.hotel_imagen }, ...safeImagesData]
        : safeImagesData;

      setGallery(fullGallery);
      setAmenities(amenitiesResponse);
      
    } catch (err) {
      console.error("Error al cargar datos:", err);
      error("Error", "No pudimos cargar la información del paquete.");
    } finally {
      hideLoading();
    }
  };

  const handleReserveClick  = async () => {
     if (!userAuth) {

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

    const hotelObj = {
      id: pkg.hotel_id,
      nombre: pkg.hotel_nombre,
      direccion: pkg.hotel_direccion,
      estrellas: pkg.hotel_estrellas,
      imagen: pkg.hotel_imagen,
      telefono: pkg.hotel_telefono,
    };

    const datesObj = {
      start: new Date(pkg.fecha_inicio).toISOString().split("T")[0],
      end: new Date(pkg.fecha_fin).toISOString().split("T")[0],
    };

    navigate("/payment", {
      state: {
        hotel: hotelObj,
        details: { precio_noche: 0 },
        dates: datesObj,
        totalDays: pkg.tiempo_estadia,
        totalPrice: pkg.precio,
      },
    });
  };

  const getTransportIcon = () => {
    if (!pkg?.transporte) return icons.bus;
    const type = pkg.transporte.toLowerCase();
    if (type.includes("avion")) return icons.planeButton;
    if (type.includes("auto")) return icons.car;
    return icons.bus;
  };

  // Proteccion
  if (!pkg) return null;

  return (
    <div className="package-page">
      <div className="main-container">
        
        <header className="pkg-header">
          <div className="header-info">
            <div className="badges">
              <span className="badge-transport">
                {getTransportIcon()} {pkg.transporte || "Transporte incluido"}
              </span>
              <span className="badge-hotel">
                {icons.hotel}
                {pkg.hotel_nombre}
              </span>
            </div>
            <h1 className="pkg-title">
              {pkg.tipo_paquete} en {pkg.ciudad}
            </h1>
            <p className="pkg-subtitle">
              {icons.location} {pkg.hotel_direccion}
            </p>
          </div>
          <div className="header-price">
            <span className="price-label">Precio Total por Persona</span>
            <span className="price-amount">
              ${Number(pkg.precio).toLocaleString()}
            </span>
          </div>
        </header>
        
        <div style={{ marginBottom: "2rem", width: "100%" }}>
          <SliderImages gallery={gallery} />
        </div>
        
        <div className="content-grid">
          
          {/* ========== COLUMNA IZQUIERDA ========== */}
          <div className="details-column">
            <div className="section-card highlight-card">
              <h3>{icons.info}Detalles del Paquete</h3>
              <p className="description-text">
                {pkg.paquete_descripcion ||
                  pkg.descripcion ||
                  "Sin descripción detallada."}
              </p>
              
              <div className="itinerary-grid">
                <div className="itinerary-item">
                  <span className="label">Fecha Salida</span>
                  <span className="value">
                    {icons.calendar}{" "}
                    {new Date(pkg.fecha_inicio).toLocaleDateString()}
                  </span>
                </div>
                <div className="itinerary-item">
                  <span className="label">Fecha Regreso</span>
                  <span className="value">
                    {icons.calendar}{" "}
                    {new Date(pkg.fecha_fin).toLocaleDateString()}
                  </span>
                </div>
                <div className="itinerary-item">
                  <span className="label">Duración</span>
                  <span className="value">
                    {icons.clock} {pkg.tiempo_estadia} días
                  </span>
                </div>
                <div className="itinerary-item">
                  <span className="label">Hospedaje</span>
                  <span className="value">
                    {icons.star} {pkg.hotel_estrellas} Estrellas
                  </span>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Servicios del Hotel ({pkg.hotel_nombre})</h3>
              {amenities && amenities.length > 0 ? (
                <div className="services-list">
                  {amenities.map((amenitie, idx) => (
                    <div key={idx} className="service-item">
                      {icons.checkCircle} {amenitie}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="description-text" style={{ fontStyle: 'italic', color: '#6b7280' }}>
                  No se han especificado servicios para este hotel.
                </p>
              )}
            </div>
          </div>
          <div className="booking-column">
            <div className="booking-card">
              
              <div className="booking-header">
                <span className="price-large">
                  ${Number(pkg.precio).toLocaleString()}
                </span>
                <span className="price-unit">MXN</span>
              </div>

              <div className="divider-solid"></div>

              <div className="summary-list">
                <div className="summary-item">
                  <span>Transporte</span>
                  <strong>{pkg.transporte}</strong>
                </div>
                <div className="summary-item">
                  <span>Hotel</span>
                  <strong>{pkg.hotel_nombre}</strong>
                </div>
                <div className="summary-item">
                  <span>Estadía</span>
                  <strong>
                    {pkg.tiempo_estadia} días / {pkg.tiempo_estadia > 0 ? pkg.tiempo_estadia - 1 : 0} noches
                  </strong>
                </div>
              </div>

              <div className="divider-dashed"></div>

              <div className="total-section">
                <span>Total a pagar</span>
                <span className="total-amount">
                  ${Number(pkg.precio).toLocaleString()}
                </span>
              </div>

              <button className="btn-book-full" onClick={handleReserveClick}>
                Reservar Paquete
              </button>
              <p className="charge-notice">
                Reserva segura. Confirmación inmediata.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackageDetails;