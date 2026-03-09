import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Filter, MapPin, ArrowDownUp, SearchX } from "lucide-react";

import cityService from "../services/cityService";
import hotelService from "../services/hotelService";

//agregamos los context
import { useAlert } from "../context/AlerContext";
import { useLoading } from "../context/LoadingContext";

import "../styles/Destination.css";
import HotelCard from "../components/HotelCard";

function AllHotels() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [backUpHotel, setBackUpHotel] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("nombre");

  const { showLoading, hideLoading } = useLoading();
  const { error } = useAlert();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterHotels();
  }, [selectedCity]);

  const loadData = async () => {
    try {
      showLoading("Cargando los hoteles");

      const [cityData, hotelData] = await Promise.all([
        cityService.getCities(),
        hotelService.getHotels(),
      ]);

      setCities(cityData || []);
      setHotels(hotelData || []);
      setBackUpHotel(hotelData || []);
    } catch (errorMessage) {
      error(
        "Error",
        "Por el momento no se pueden cargar los datos inténtelo más tarde",
      );
      setCities([]);
      setHotels([]);
    } finally {
      hideLoading();
    }
  };

  // Función para filtrar hoteles
  const filterHotels = async () => {
    if (!selectedCity) {
      setHotels(backUpHotel);
      return;
    }
    
    try {
      showLoading("Buscando hoteles");
      const cityHotels = await hotelService.getHotelCity(selectedCity);
      setHotels(cityHotels || []);
    } catch (err) { 
      console.error("Error filtrando los hoteles:", err);
      setHotels([]);
      error(
        "Error de búsqueda",
        "No se pudieron cargar los hoteles de la ciudad seleccionada."
      );
    } finally {
      hideLoading(); 
    }
  };

  const getSortedHotels = () => {
    return [...hotels].sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "estrellas":
          return (b.estrellas || 0) - (a.estrellas || 0);
        default:
          return 0;
      }
    });
  };

  // Ahora esto sí recibe un arreglo válido
  const filteredHotels = getSortedHotels();

  return (
    <div className="app">
      <section className="ah-header">
        <div className="ah-header-content">
          <button className="ah-btn-back" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </button>

          <h1 className="ah-title">Todos nuestros hoteles</h1>
          <p className="ah-subtitle">
            Descubre {hotels.length} hoteles increíbles en {cities.length}{" "}
            destinos
          </p>
        </div>
      </section>

      <section className="ah-filters-section">
        <div className="ah-filters-card">
          <div className="ah-filter-group">
            <div className="ah-filter-icon">
              <MapPin size={22} />
            </div>
            <select
              className="ah-select"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
            >
              <option value="">Explorar todas las ciudades</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="ah-filter-group">
            <div className="ah-filter-icon">
              <ArrowDownUp size={22} />
            </div>
            <select
              className="ah-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nombre">Ordenar por nombre (A-Z)</option>
              <option value="estrellas">Mejor calificados</option>
            </select>
          </div>

          <div className="ah-counter-badge">
            <Filter
              size={14}
              style={{
                display: "inline",
                marginRight: "6px",
                verticalAlign: "middle",
              }}
            />
            {filteredHotels.length}{" "}
            {filteredHotels.length === 1 ? "resultado" : "resultados"}
          </div>
        </div>
      </section>

      <section className="ah-body-section">
        <div className="ah-body-container">
          {filteredHotels.length > 0 ? (
            <div className="packages-grid">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                   hotelDetails={hotel.id}
                />
              ))}
            </div>
          ) : (
            <div className="ah-empty-state">
              <div className="ah-empty-icon-wrapper">
                <SearchX size={40} />
              </div>
              <h3 className="ah-empty-title">Sin resultados</h3>
              <p className="ah-empty-text">
                No pudimos encontrar hoteles que coincidan con esta ciudad.
                Intenta cambiar los filtros de búsqueda para explorar más
                destinos.
              </p>
              {selectedCity && (
                <button
                  className="ah-btn-clear"
                  onClick={() => setSelectedCity("")}
                >
                  Ver todos los hoteles
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AllHotels;