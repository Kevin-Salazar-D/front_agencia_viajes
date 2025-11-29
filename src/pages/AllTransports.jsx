import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, Bus, Plane, Users, 
  DollarSign, ChevronRight, Loader 
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const AllTransports = () => {
  const navigate = useNavigate();
  
  const [transports, setTransports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'avion', 'camion'

  useEffect(() => {
    fetchTransports();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, typeFilter, transports]);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transportes/obtenerTodosTransportes`);
      if (!response.ok) throw new Error('Error al cargar transportes');
      const data = await response.json();
      setTransports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar la lista de transportes.');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = transports;

    // Filtro por tipo
    if (typeFilter !== 'all') {
      result = result.filter(t => t.tipo?.toLowerCase() === typeFilter.toLowerCase());
    }

    // Búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.nombre?.toLowerCase().includes(term) || 
        t.modelo?.toLowerCase().includes(term)
      );
    }

    setFiltered(result);
  };

  // Imágenes estáticas según tipo (ya que la BD no tiene campo imagen para transportes)
  const getImageByType = (type) => {
    if (type?.toLowerCase() === 'avion') {
      return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=60';
    }
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60';
  };

  if (loading) return (
    <div className="page-container loading">
      <Loader size={40} className="spinner" />
      <p>Cargando flota...</p>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => navigate('/')} className="btn-back">
            <ArrowLeft size={20} /> Volver al Inicio
          </button>
          <h1>Nuestra Flota</h1>
          <p>Viaja con comodidad y seguridad en nuestros aviones y autobuses de primera clase.</p>
        </div>
      </header>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o modelo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <button 
            className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${typeFilter === 'avion' ? 'active' : ''}`}
            onClick={() => setTypeFilter('avion')}
          >
            <Plane size={16} /> Aéreos
          </button>
          <button 
            className={`filter-btn ${typeFilter === 'camion' ? 'active' : ''}`}
            onClick={() => setTypeFilter('camion')}
          >
            <Bus size={16} /> Terrestres
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-container">
        {filtered.map(item => (
          <div key={item.id} className="transport-card" onClick={() => navigate(`/transporte/${item.id}`)}>
            <div className="card-image">
              <img src={getImageByType(item.tipo)} alt={item.nombre} />
              <span className={`badge ${item.tipo}`}>
                {item.tipo === 'avion' ? <Plane size={12}/> : <Bus size={12}/>} {item.tipo}
              </span>
            </div>
            <div className="card-body">
              <h3>{item.nombre}</h3>
              <p className="model">{item.modelo}</p>
              
              <div className="specs">
                <div className="spec">
                  <Users size={16} />
                  <span>Cap: {item.capacidad}</span>
                </div>
                <div className="spec">
                  <DollarSign size={16} />
                  <span>Desde ${item.precio || 'Consultar'}</span>
                </div>
              </div>

              <button className="btn-details">
                Ver Detalles <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .page-container { min-height: 100vh; background: #f3f4f6; padding-bottom: 4rem; font-family: 'Inter', sans-serif; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #2563eb; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .page-header { background: white; padding: 2rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .header-content { max-width: 1200px; margin: 0 auto; }
        .header-content h1 { font-size: 2rem; color: #1f2937; margin: 1rem 0 0.5rem; }
        .header-content p { color: #6b7280; }
        
        .btn-back { background: none; border: none; color: #2563eb; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; padding: 0; }

        .controls-section { max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: center; }
        
        .search-bar { position: relative; flex: 1; min-width: 280px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .search-bar input { width: 100%; padding: 12px 12px 12px 40px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 1rem; outline: none; }
        .search-bar input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

        .filters { display: flex; gap: 0.5rem; }
        .filter-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #e5e7eb; background: white; border-radius: 20px; cursor: pointer; color: #4b5563; font-weight: 500; transition: all 0.2s; }
        .filter-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
        .filter-btn:hover:not(.active) { background: #f9fafb; }

        .grid-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }

        .transport-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .transport-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        .card-image { height: 180px; position: relative; background: #e5e7eb; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; }
        .badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; text-transform: capitalize; display: flex; align-items: center; gap: 4px; }
        .badge.avion { background: #0ea5e9; }
        .badge.camion { background: #f59e0b; }

        .card-body { padding: 1.5rem; }
        .card-body h3 { margin: 0 0 4px 0; color: #1f2937; font-size: 1.1rem; }
        .model { color: #6b7280; font-size: 0.9rem; margin: 0 0 1rem 0; }

        .specs { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .spec { display: flex; align-items: center; gap: 6px; color: #4b5563; font-size: 0.9rem; background: #f3f4f6; padding: 4px 8px; border-radius: 6px; }

        .btn-details { width: 100%; background: white; border: 1px solid #2563eb; color: #2563eb; padding: 10px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .btn-details:hover { background: #eff6ff; }
      `}</style>
    </div>
  );
};

export default AllTransports;