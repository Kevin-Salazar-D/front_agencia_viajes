import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import icons from "../constants/icons";
import { useAlert } from "../context/AlerContext";

import '../styles/SearchBar.css';

const SearchBar = ({ cities }) => {
  const navigate = useNavigate();
  const { error, warning } = useAlert();

  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleValidations = () => {
    if (!searchData.origin) {
      error("Campo incompleto", "Por favor selecciona una ciudad de origen");
      return false;
    }
    if (!searchData.destination) {
      error("Campo incompleto", "Por favor selecciona una ciudad de destino");
      return false;
    }
    if (!searchData.startDate) {
      error("Campo incompleto", "Por favor selecciona una fecha de inicio");
      return false;
    }
    if (!searchData.endDate) {
      error("Campo incompleto", "Por favor selecciona una fecha de finalización");
      return false;
    }
    if (searchData.origin === searchData.destination) {
      error("Destinos iguales", "El origen y destino no pueden ser la misma ciudad");
      return false;
    }
    if (new Date(searchData.startDate) >= new Date(searchData.endDate)) {
      error("Fechas inválidas", "La fecha de inicio debe ser anterior a la fecha de fin");
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!handleValidations()) return;
    setIsSearching(true);

    try {
      // Simulamos carga de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const originCity = cities.find((c) => c.id === parseInt(searchData.origin));
      const destCity = cities.find((c) => c.id === parseInt(searchData.destination));
      
      warning("¡Búsqueda en curso!", `Buscando de ${originCity?.nombre} a ${destCity?.nombre}`);

      setTimeout(() => {
        navigate(`/journeyDestiny/${searchData.origin}/${searchData.destination}`);
      }, 500);
    } catch (err) {
      error("Error", "Ocurrió un problema técnico.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-grid">
        
        {/* ORIGEN */}
        <div className="search-field">
          <label>Origen</label>
          <div className="input-relative">
            {React.cloneElement(icons.location, { className: "field-icon" })}
            <select
              value={searchData.origin}
              onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
              disabled={isSearching}
            >
              <option value="">Seleccionar ciudad</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* DESTINO */}
        <div className="search-field">
          <label>Destino</label>
          <div className="input-relative">
            {React.cloneElement(icons.location, { className: "field-icon" })}
            <select
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              disabled={isSearching}
            >
              <option value="">Seleccionar ciudad</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FECHA INICIO */}
        <div className="search-field">
          <label>Salida</label>
          <div className="input-relative">
            {React.cloneElement(icons.calendar, { className: "field-icon" })}
            <input
              type="date"
              value={searchData.startDate}
              onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              disabled={isSearching}
            />
          </div>
        </div>

        {/* FECHA FIN */}
        <div className="search-field">
          <label>Regreso</label>
          <div className="input-relative">
            {React.cloneElement(icons.calendar, { className: "field-icon" })}
            <input
              type="date"
              value={searchData.endDate}
              onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
              min={searchData.startDate || new Date().toISOString().split("T")[0]}
              disabled={isSearching}
            />
          </div>
        </div>

        {/* BOTÓN BUSCAR */}
        <div className="search-field button-align">
          <button onClick={handleSearch} disabled={isSearching} className="btn-search-main">
            {isSearching ? (
              <div className="loader-mini"></div>
            ) : (
              <>
                {React.cloneElement(icons.search, { size: 20 })}
                <span>Explorar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;