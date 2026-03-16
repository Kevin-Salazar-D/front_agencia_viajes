import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import icons from "../constants/icons";

// Importación del servicio
import trasportService from "../services/transportService";
// Importamos alertas y el loading
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlerContext";
// Importamos el CSS
import "../styles/AllTransports.css";

// Componentes
import TransportCard from "../components/TrasportCard";

const AllTransports = () => {
  const navigate = useNavigate();

  // Estados
  const [transports, setTransports] = useState([]);
  const [transportsBackUp, setTransportsBackUp] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { error, success } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchTransports();
  }, []);

  useEffect(() => {
      fetchFilteredTrasport();
  }, [typeFilter]);

  useEffect(() => {
    filterData();
  }, [searchTerm, transports]);

  const fetchTransports = async () => {
    try {
      showLoading("Cargando la flota...");
      const response = await trasportService.getTrasport();
      setTransports(response || []);
      setTransportsBackUp(response || []);
    } catch (err) {
      console.error(err);
      error(
        "Error",
        "No se pudieron obtener los datos de los transportes. Inténtalo de nuevo."
      );
    } finally {
      hideLoading();
    }
  };

  const fetchFilteredTrasport = async () => {
    if (typeFilter === "all") {
      setTransports(transportsBackUp);
      return;
    }
    
    try {
      showLoading(`Buscando transportes tipo ${typeFilter}...`);
      console.log("Esto se filtra ", typeFilter);
      const response = await trasportService.getTrasportType(typeFilter);
      setTransports(response || []);
    } catch (err) {
      error("Error", "No se pudo obtener el tipo de transporte.");
      setTransports([]);
    } finally {
      hideLoading();
    }
  };

  const filterData = () => {
    let result = transports;
    // Filtro local de texto por nombre o modelo
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.nombre?.toLowerCase().includes(term) ||
          t.modelo?.toLowerCase().includes(term)
      );
    }
    setFiltered(result);
  };

  return (
    <div className="transport-ui-page">
      
      <section className="transport-ui-banner">
        <div className="transport-ui-banner-content">
          <button
            className="transport-ui-btn-back"
            onClick={() => navigate("/")}
          >
            {icons.backArrow}
            <span>Volver al inicio</span>
          </button>

          <h1>Nuestra Flota Premium</h1>
          <p>
            Comodidad, seguridad y el mejor servicio en cada kilómetro o milla
            de tu viaje.
          </p>
        </div>
      </section>

      <section className="transport-ui-controls">
        <div className="transport-ui-controls-wrapper">
          {/* Grupo de Búsqueda */}
          <div className="transport-ui-filter-group">
            <div className="transport-ui-filter-icon">
              {icons.search}
            </div>
            <input
              className="transport-ui-input"
              type="text"
              placeholder="Buscar modelo o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="transport-ui-filters-tabs">
            <button
              className={`transport-ui-tab ${typeFilter === "all" ? "active" : ""}`}
              onClick={() => setTypeFilter("all")}
            >
              Todos
            </button>
            <button
              className={`transport-ui-tab ${typeFilter === "avion" ? "active" : ""}`}
              onClick={() => setTypeFilter("avion")}
            >
              {icons.planeButton} Aéreos
            </button>
            <button
              className={`transport-ui-tab ${typeFilter === "camion" ? "active" : ""}`}
              onClick={() => setTypeFilter("camion")}
            >
              {icons.busButton} Terrestres
            </button>
          </div>
          <div className="transport-ui-counter-badge">
            {icons.filterBadge}
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </div>
        </div>
      </section>

      <section className="transport-ui-grid-section">
        
        {filtered.length === 0 ? (
          <div className="transport-ui-empty-state">
            <div className="transport-ui-empty-icon-wrapper">
              {icons.searchLarge}
            </div>
            <h3 className="transport-ui-empty-title">Sin resultados</h3>
            <p className="transport-ui-empty-text">
              No encontramos transportes que coincidan con tu búsqueda. Intenta
              con otro modelo o cambia de categoría.
            </p>
            {(searchTerm || typeFilter !== "all") && (
              <button
                className="transport-ui-btn-clear"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
              >
                Ver toda la flota
              </button>
            )}
          </div>
        ) : (
          <div className="transport-ui-grid">
            {filtered.map((item) => (
              <TransportCard key={item.id} transport={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllTransports;