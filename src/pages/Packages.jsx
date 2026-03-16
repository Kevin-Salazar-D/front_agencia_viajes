import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// importaciones de iconos
import icons from '../constants/icons'; 

// HOOKS
import { useLoading } from '../context/LoadingContext';
import { useAlert } from "../context/AlerContext";

// Importación de servicios
import hotelService from '../services/hotelService'; 
import packagesService from '../services/packageService';
import cityService from "../services/cityService";

//css
import '../styles/AllPackages.css';

// Componentes reutilizables
import PackageCard from "../components/PackageCard";

function Packages() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { error } = useAlert();
  
  // Estados de datos
  const [cities, setCities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]); 
  
  // Estados de los filtros completos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(''); 
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      showLoading("Cargando paquetes...");

      const [packagesResponse, hotelResponse, cityResponse] = await Promise.all([
        packagesService.getPackages(),
        hotelService.getHotels(),
        cityService.getCities()
      ]);

      setPackages(packagesResponse || []);
      setHotels(hotelResponse || []);
      setCities(cityResponse || []);

    } catch (err) {
      error("Error.", "Error obteniendo los datos. Inténtelo de nuevo.");
    } finally {
      hideLoading();
    }
  };

  // Función maestra para filtrar y ordenar
  const getFilteredAndSortedPackages = () => {
    let result = [...packages]; 

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pkg => 
        pkg.hotel_nombre?.toLowerCase().includes(term) ||
        pkg.tipo_paquete?.toLowerCase().includes(term)
      );
    }

    if (selectedCity) {
      result = result.filter(pkg => pkg.ciudad_id === parseInt(selectedCity));
    }

    if (selectedType) {
      result = result.filter(pkg => pkg.tipo_paquete === selectedType);
    }

    if (selectedHotel) {
      result = result.filter(pkg => pkg.hotel_id === parseInt(selectedHotel));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'precio_asc':
          return (a.precio || 0) - (b.precio || 0);
        case 'precio_desc':
          return (b.precio || 0) - (a.precio || 0);
        case 'duracion_asc':
          return (a.tiempo_estadia || 0) - (b.tiempo_estadia || 0);
        case 'duracion_desc':
          return (b.tiempo_estadia || 0) - (a.tiempo_estadia || 0);
        default:
          return 0; 
      }
    });

    return result;
  };

  const filteredPackages = getFilteredAndSortedPackages();
  const packageTypes = [...new Set(packages.map(p => p.tipo_paquete))].filter(Boolean);

  return (
    <div className="pkg-ui-page">
      
      <section className="pkg-ui-banner">
        <div className="pkg-ui-banner-content">
          <button className="pkg-ui-btn-back" onClick={() => navigate('/')}>
            {icons.backArrow}
            <span>Volver al inicio</span>
          </button>
          
          <div className="pkg-ui-title-wrapper">
            {icons.packageBanner}
            <h1>Paquetes completos</h1>
          </div>
          <p>Viajes todo incluido: transporte + hotel en un solo paquete</p>
        </div>
      </section>

      <section className="pkg-ui-controls">
        <div className="pkg-ui-controls-wrapper">
      
          <div className="pkg-ui-filter-group">
            <div className="pkg-ui-filter-icon">
              {icons.sort}
            </div>
            <select 
              className="pkg-ui-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Ordenar por...</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="duracion_desc">Duración: Más largos primero</option>
              <option value="duracion_asc">Duración: Más cortos primero</option>
            </select>
          </div>

          <div className="pkg-ui-filter-group">
            <div className="pkg-ui-filter-icon">
              {icons.locationFilter}
            </div>
            <select 
              className="pkg-ui-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.nombre}</option>
              ))}
            </select>
          </div>

          <div className="pkg-ui-filter-group">
            <div className="pkg-ui-filter-icon">
              {icons.building}
            </div>
            <select 
              className="pkg-ui-select"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value="">Todos los hoteles</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
              ))}
            </select>
          </div>
          <div className="pkg-ui-filter-group">
            <div className="pkg-ui-filter-icon">
              {icons.tag}
            </div>
            <select 
              className="pkg-ui-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {packageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="pkg-ui-filter-group">
            <div className="pkg-ui-filter-icon">
              {icons.search}
            </div>
            <input 
              type="text"
              className="pkg-ui-input"
              placeholder="Buscar por descripción, características, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="pkg-ui-counter-badge">
            {icons.filterBadge}
            {filteredPackages.length} {filteredPackages.length === 1 ? 'resultado' : 'resultados'}
          </div>
        </div>
      </section>
      <section className="pkg-ui-grid-section">
        {filteredPackages.length > 0 ? (
          <div className="pkg-ui-grid">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.paquete_id || pkg.id} packageData={pkg} />
            ))}
          </div>
        ) : (
          <div className="pkg-ui-empty-state">
             <div className="pkg-ui-empty-icon-wrapper">
               {icons.searchX}
             </div>
             <h3 className="pkg-ui-empty-title">Sin resultados</h3>
             <p className="pkg-ui-empty-text">
               No encontramos paquetes que coincidan con tu búsqueda actual. Intenta cambiar los filtros o explora otros destinos.
             </p>
             {(selectedCity || selectedType || selectedHotel || searchTerm || sortBy) && (
               <button 
                 className="pkg-ui-btn-clear"
                 onClick={() => {
                   setSelectedCity('');
                   setSelectedType('');
                   setSelectedHotel('');
                   setSearchTerm('');
                   setSortBy('');
                 }}
               >
                 Limpiar todos los filtros
               </button>
             )}
          </div>
        )}
      </section>

    </div>
  );
}
export default Packages;