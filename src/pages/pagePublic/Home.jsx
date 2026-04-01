import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader, MapPin } from "lucide-react";

// Hooks Globales
import { useLoading } from "@/context/LoadingContext";
import { useAlert } from "@/context/AlerContext";

// Componentes
import HotelCard from "@/components/cards/HotelCard";
import SearchBar from "@/components/navigation/SearchBar";

// Servicios
import cityService from "@/services/cityService";
import hotelService from "@/services/hotelService";

// Estilos
import "@/App.css";

function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [hotelsBackUp, setHotelBacUp] = useState([]);
  
  // Hooks de Contexto Global
  const { showLoading, hideLoading } = useLoading();
  const { error } = useAlert();

  //loadData
  const loadData = async () => {
  try {
    showLoading("Preparando tu próxima aventura...");

    const [cityData, hotelData] = await Promise.all([
      cityService.getCities(),
      hotelService.getHotels(),
    ]);

    const citiesArray = Array.isArray(cityData)
      ? cityData
      : cityData?.cities || cityData?.data || [];

    const hotelsArray = Array.isArray(hotelData)
      ? hotelData
      : hotelData?.hotels || hotelData?.data || [];

    setCities(citiesArray);
    setHotels(hotelsArray);
    setHotelBacUp(hotelsArray);

  } catch (err) {
    console.error("Error cargando datos:", err);
    setCities([]);
    setHotels([]);
    error(
      "Problema de conexión",
      "No pudimos cargar los datos iniciales. Por favor, intenta de nuevo más tarde."
    );
  } finally {
    hideLoading();
  }
};
  // Función para filtrar los hoteles desde el backend
  const filterHotels = async () => {
    // Si no hay ciudad seleccionada, restauramos el respaldo
    if (!selectedCity) {
      setHotels(hotelsBackUp);
      return;
    }

    try {
      const cityHotels = await hotelService.getHotelCity(selectedCity);
      setHotels(cityHotels || []);
    } catch (err) {
      console.error("Error filtrando los hoteles:", err);
      setHotels([]);
      // Disparamos la alerta si falla el filtrado
      error(
        "Error de búsqueda",
        "No se pudieron cargar los hoteles de la ciudad seleccionada."
      );
    }
  };

  // Ejecutar carga inicial al montar
  useEffect(() => {
    loadData();
  }, []);

  // Ejecutar filtrado cada vez que cambie la ciudad seleccionada
  useEffect(() => {
    filterHotels();
  }, [selectedCity]);

  return (
    <div className="app">
      {/* ========== HERO SECTION ========== */}
      <section id="inicio" className="hero">
        <div className="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600"
          alt="Viajes"
          className="hero-image"
        />

        <div className="hero-content">
          <h1 className="hero-title">
            Descubre tu próxima
            <br />
            <span className="gradient-text">aventura perfecta</span>
          </h1>
          <p className="hero-subtitle">
            Los mejores paquetes de viaje con hoteles y transporte incluido
          </p>

          <SearchBar cities={cities} />
        </div>
      </section>

      <section id="ofertas" className="packages-section">
        <div className="modern-section-header">
          {/* Título y Subtítulo */}
          <div className="header-titles">
            <h2>Hoteles destacados</h2>
            <p>
              {hotels.length > 0
                ? `${hotels.length} hoteles disponibles en nuestra red`
                : "Buscando hoteles..."}
            </p>
          </div>
          <div className="header-controls-card">
            <div className="control-filter">
              <label className="control-label">Filtrar por ubicación</label>
              <div className="control-input-box">
                <MapPin size={22} className="control-icon" />
                <select
                  className="control-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Explorar todas las ciudades</option>
                  {cities &&
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Divisor Visual en Escritorio */}
            <div className="control-divider"></div>

            {/* Botones de acción */}
            <div className="control-actions">
              <button
                className="btn-control-secondary"
                onClick={() => navigate("/paquetes")}
              >
                Ver paquetes <ArrowRight size={18} />
              </button>
              <button
                className="btn-control-primary"
                onClick={() => navigate("/destinos")}
              >
                Todos los hoteles <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="packages-grid">
          {hotels.length > 0 ? (
            hotels
              .slice(0, 6)
              .map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  hotelDetails={hotel.id}
                />
              ))
          ) : (
            <div className="empty-state-hotels">
              <MapPin size={48} className="empty-icon" />
              <p>
                No hay hoteles disponibles para esta ciudad en este momento.
              </p>
              <button
                className="btn-control-secondary"
                onClick={() => setSelectedCity("")}
              >
                Limpiar filtro
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{cities ? cities.length : 0}+</div>
              <div className="stat-label">Destinos</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Viajeros felices</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{hotelsBackUp ? hotelsBackUp.length : 0}+</div>
              <div className="stat-label">Hoteles aliados</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.8★</div>
              <div className="stat-label">Calificación</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;