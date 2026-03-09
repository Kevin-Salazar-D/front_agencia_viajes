import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bus, Plane, Users, CheckCircle, Shield, SearchX 
} from 'lucide-react';

import { useLoading } from '../context/LoadingContext';
import { useAlert } from "../context/AlerContext";

import trasportService from '../services/transportService';
// Importamos el nuevo CSS aislado
import '../styles/TrasportDetails.css';

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, success } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  
  const [transport, setTransport] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadTransport();
  }, [id]);

  const loadTransport = async () => {
    try {
      showLoading("Cargando el dato del transporte...");
      
      const response = await trasportService.getTrasportID(id);
      
      // Verificamos si response existe y tiene datos
      if (response) {
        setTransport(response);
      } else {
        throw new Error("No se encontraron datos");
      }

    } catch (err) {
      console.error(err);
      // Usamos tu función error del contexto
      error("Error de Conexión", "No se pudo encontrar el transporte. Inténtalo de nuevo.");
      // Opcional: regresar a la lista si no existe
      // navigate('/transportes'); 
    } finally {
      hideLoading();
    }
  };

  const getImageByType = (type) => {
    return type?.toLowerCase() === "avion" 
      ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80' 
      : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80';
  };

  // ESCUDO: Si no hay transporte, no intentamos dibujar la tarjeta todavía
// ESCUDO: Si no hay transporte, mostramos un diseño premium de "No encontrado"
  if (!transport) {
    return (
      <div className="td-page">
        <div className="td-main-container">
          <button className="td-btn-back-inline" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Volver a la flota
          </button>

          <div className="td-empty-state">
            <div className="td-empty-icon-wrapper">
              <SearchX size={48} />
            </div>
            <h2 className="td-empty-title">Transporte no encontrado</h2>
            <p className="td-empty-text">
              Lo sentimos, no pudimos localizar los detalles de este vehículo. Es posible que el enlace sea incorrecto o que el transporte ya no forme parte de nuestra flota premium.
            </p>
            <button 
              className="td-btn-clear"
              onClick={() => navigate(-1)}
            >
              Explorar otros transportes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="td-page">
      <div className="td-main-container">
        
        {/* Botón de volver sutil */}
        <button className="td-btn-back-inline" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Volver a la flota
        </button>

        {/* Hero Section (Imagen Premium) */}
        <div className="td-hero-section">
          {/* Ya es seguro usar transport.tipo porque pasamos el escudo */}
          <img src={getImageByType(transport.tipo)} alt={transport.nombre} className="td-hero-bg" />
          <div className="td-hero-overlay">
            <div className="td-hero-content">
              <span className={`td-type-badge ${transport.tipo?.toLowerCase()}`}>
                {transport.tipo?.toLowerCase() === 'avion' ? <Plane size={16}/> : <Bus size={16}/>} {transport.tipo}
              </span>
              <h1>{transport.nombre}</h1>
              <p className="td-model-text">{transport.modelo}</p>
            </div>
          </div>
        </div>

        {/* Info Wrapper */}
        <div className="td-info-wrapper">
          <div className="td-info-card">
            <h2>Detalles del Transporte</h2>
            
            <div className="td-specs-grid">
              <div className="td-spec-item">
                <Users size={28} className="td-spec-icon" />
                <div className="td-spec-text">
                  <label>Capacidad</label>
                  <strong>{transport.capacidad} Pasajeros</strong>
                </div>
              </div>
              
              <div className="td-spec-item">
                <CheckCircle size={28} className="td-spec-icon" />
                <div className="td-spec-text">
                  <label>Disponibilidad</label>
                  <strong>{transport.asientos_disponibles} Asientos libres</strong>
                </div>
              </div>
              
              <div className="td-spec-item">
                <Shield size={28} className="td-spec-icon" />
                <div className="td-spec-text">
                  <label>Seguridad</label>
                  <strong>Seguro de viajero incl.</strong>
                </div>
              </div>
            </div>
            
            <div className="td-description">
              <h3>Acerca de este transporte</h3>
              <p>
                Viaja con la comodidad y seguridad que <strong>{transport.nombre}</strong> ofrece. 
                El modelo <strong>{transport.modelo}</strong> cuenta con asientos ergonómicos, 
                climatización de primer nivel y los más altos estándares de seguridad 
                para hacer tu viaje una experiencia completamente placentera y libre de estrés.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransportDetails;