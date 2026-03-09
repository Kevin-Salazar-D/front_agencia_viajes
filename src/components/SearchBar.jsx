import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import { MapPin, Calendar, Search } from 'lucide-react';

import { useAlert } from '../context/AlerContext';

import '../styles/SearchBar.css';


const SearchBar = ({ cities }) => {
  const navigate = useNavigate(); // Instanciamos el hook de navegación
  
  // Instanciamos tu hook de alertas
 const { error, success } = useAlert();

  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    // Usamos la función 'error' de tu hook useAlert
    if (!searchData.origin) {
      error('Campo incompleto', 'Por favor selecciona una ciudad de origen');
      return;
    }
    
    if (!searchData.destination) {
      error('Campo incompleto', 'Por favor selecciona una ciudad de destino');
      return;
    }
    
    if (!searchData.startDate) {
      error('Campo incompleto', 'Por favor selecciona una fecha de inicio');
      return;
    }
    
    if (!searchData.endDate) {
      error('Campo incompleto', 'Por favor selecciona una fecha de finalización');
      return;
    }

    if (searchData.origin === searchData.destination) {
      error('Destinos iguales', 'El origen y destino no pueden ser la misma ciudad');
      return;
    }

    if (new Date(searchData.startDate) >= new Date(searchData.endDate)) {
      error('Fechas inválidas', 'La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setIsSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const originCity = cities.find(c => c.id === parseInt(searchData.origin));
      const destCity = cities.find(c => c.id === parseInt(searchData.destination));

      // Usamos la función 'success' de tu hook useAlert
      success('¡Búsqueda exitosa!', `Buscando viajes de ${originCity?.nombre} a ${destCity?.nombre}`);

      setTimeout(() => {
        // Redirigimos usando la instancia de useNavigate que creamos arriba
        navigate(`/resultados?from=${searchData.origin}&to=${searchData.destination}&start=${searchData.startDate}&end=${searchData.endDate}`);
      }, 500);

    } catch (err) {
      error('Error en la búsqueda', 'Ocurrió un problema. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="search-bar">
        <div className="search-grid">
          
          <div className="search-field">
            <label>Origen</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={20} />
              <select 
                value={searchData.origin}
                onChange={(e) => setSearchData({...searchData, origin: e.target.value})}
                disabled={isSearching}
              >
                <option value="">Seleccionar ciudad</option>
                {cities && cities.map(city => (
                  <option key={city.id} value={city.id}>{city.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-field">
            <label>Destino</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={20} />
              <select 
                value={searchData.destination}
                onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                disabled={isSearching}
              >
                <option value="">Seleccionar ciudad</option>
                {cities && cities.map(city => (
                  <option key={city.id} value={city.id}>{city.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-field">
            <label>Fecha inicio</label>
            <div className="input-wrapper">
              <Calendar className="input-icon" size={20} />
              <input 
                type="date"
                value={searchData.startDate}
                onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
                min={new Date().toISOString().split('T')}
                disabled={isSearching}
              />
            </div>
          </div>

          <div className="search-field">
            <label>Fecha fin</label>
            <div className="input-wrapper">
              <Calendar className="input-icon" size={20} />
              <input 
                type="date"
                value={searchData.endDate}
                onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
                min={searchData.startDate || new Date().toISOString().split('T')}
                disabled={isSearching}
              />
            </div>
          </div>

          <div className="search-field search-button-wrapper">
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-search"
            >
              {isSearching ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  <span>Buscando...</span>
                </span>
              ) : (
                <>
                  <Search size={20} />
                  <span>Buscar</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default SearchBar;