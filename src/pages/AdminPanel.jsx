import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Bed, Bus, Users, Plus, Edit2, Trash2, X, Search, 
  Save, AlertCircle, CheckCircle, Briefcase, User, WifiOff, RefreshCw, AlertTriangle 
} from 'lucide-react';

// ========== CONFIGURACIÓN EXACTA SEGÚN TU APP.JS ==========
const API_BASE = 'http://localhost:3000/agenciaViajes';

// ========== COMPONENTES UI COMPARTIDOS ==========

// Componente Alert actualizado
const Alert = ({ type = 'info', title, message, onClose, autoClose = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle size={24} />;
      case 'success': return <CheckCircle size={24} />;
      case 'warning': return <AlertCircle size={24} />;
      default: return <AlertCircle size={24} />;
    }
  };

  const alertStyles = {
    error: { border: '#fecaca', bg: '#fef2f2', icon: '#dc2626', title: '#991b1b', text: '#7f1d1d' },
    success: { border: '#86efac', bg: '#f0fdf4', icon: '#10b981', title: '#065f46', text: '#047857' },
    warning: { border: '#fcd34d', bg: '#fffbeb', icon: '#f59e0b', title: '#92400e', text: '#b45309' },
    info: { border: '#bfdbfe', bg: '#eff6ff', icon: '#2563eb', title: '#1e40af', text: '#1d4ed8' }
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px', maxWidth: '400px', display: 'flex', alignItems: 'flex-start',
      gap: '12px', padding: '16px', background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', zIndex: 9999, animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ color: style.icon, flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: style.title }}>{title}</h4>}
        <p style={{ margin: 0, fontSize: '0.875rem', color: style.text }}>{message}</p>
      </div>
      <button onClick={() => { setIsVisible(false); onClose?.(); }} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>
        <X size={20} />
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%',
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// NUEVO: Modal de Confirmación para eliminar
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth: '400px', width: '100%',
        padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ 
            margin: '0 auto 16px', width: '56px', height: '56px', borderRadius: '50%', 
            background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
            <AlertTriangle size={28} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose} 
            style={{ 
                flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', 
                background: 'white', fontWeight: '600', color: '#374151', cursor: 'pointer',
                transition: 'background 0.2s'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            style={{ 
                flex: 1, padding: '12px', border: 'none', borderRadius: '8px', 
                background: '#dc2626', fontWeight: '600', color: 'white', cursor: 'pointer',
                transition: 'background 0.2s', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)'
            }}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Fetch seguro con manejo de errores JSON
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en fetch a ${url}:`, error);
    throw error;
  }
};

// ========== GESTORES DE CONTENIDO ==========

// 1. GESTOR DE CIUDADES
const CiudadesManager = ({ onUpdate, onError }) => {
  const [ciudades, setCiudades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', pais: '', region: '', codigo_postal: '' });
  
  // Estado para confirmación de eliminación
  const [deleteId, setDeleteId] = useState(null);

  const fetchCiudades = async () => {
    try {
      const data = await safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`);
      setCiudades(Array.isArray(data) ? data : []);
    } catch (e) { 
      onError('Error cargando ciudades.');
    }
  };

  useEffect(() => { fetchCiudades(); }, []);

  const handleSubmit = async () => {
    try {
      const url = editing ? `${API_BASE}/ciudades/actualizarCiudad` : `${API_BASE}/ciudades/crearCiudad`;
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      
      await safeFetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      
      onUpdate('success', `Ciudad ${editing ? 'actualizada' : 'creada'} correctamente`);
      setModalOpen(false);
      fetchCiudades();
    } catch (e) { onUpdate('error', e.message); }
  };

  // Ejecutar eliminación después de confirmar
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await safeFetch(`${API_BASE}/ciudades/borrarCiudad`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
      });
      onUpdate('success', 'Ciudad borrada');
      fetchCiudades();
    } catch (e) { onUpdate('error', e.message); }
    setDeleteId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => { setEditing(null); setForm({ nombre: '', pais: '', region: '', codigo_postal: '' }); setModalOpen(true); }} className="btn-primary">
          <Plus size={20} /> Nueva Ciudad
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
            <thead><tr><th>Nombre</th><th>País</th><th>Región</th><th>C.P.</th><th>Acciones</th></tr></thead>
            <tbody>
            {ciudades.map(c => (
                <tr key={c.id}>
                    <td>{c.nombre}</td><td>{c.pais}</td><td>{c.region}</td><td>{c.codigo_postal}</td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => { setEditing(c); setForm(c); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(c.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Ciudad" : "Nueva Ciudad"}>
        <div className="form-grid">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" />
          <input placeholder="País" value={form.pais} onChange={e => setForm({...form, pais: e.target.value})} className="input-field" />
          <input placeholder="Región" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="input-field" />
          <input placeholder="Código Postal" value={form.codigo_postal} onChange={e => setForm({...form, codigo_postal: e.target.value})} className="input-field" />
          <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
        </div>
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={executeDelete}
        title="¿Eliminar Ciudad?"
        message="Esta acción borrará la ciudad permanentemente. ¿Estás seguro?"
      />
    </div>
  );
};

// 2. GESTOR DE HOTELES
const HotelesManager = ({ onUpdate, onError, ciudades }) => {
  const [hoteles, setHoteles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad_id: '', estrellas: 5, telefono: '', imagen: '' });
  
  const [deleteId, setDeleteId] = useState(null);

  const fetchHoteles = async () => {
    try {
      const data = await safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`);
      setHoteles(Array.isArray(data) ? data : []);
    } catch (e) { 
        onError('Error cargando hoteles.');
    }
  };

  useEffect(() => { fetchHoteles(); }, []);

  const handleSubmit = async () => {
    try {
      const url = editing ? `${API_BASE}/hoteles/actualizarHotel` : `${API_BASE}/hoteles/crearHotel`;
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      
      await safeFetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });

      if (editing && editing.ciudad_id !== form.ciudad_id) {
            await safeFetch(`${API_BASE}/hoteles/actualizarCiudadIdHotel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editing.id, ciudad_id: form.ciudad_id })
            });
      }
      onUpdate('success', 'Hotel guardado correctamente');
      setModalOpen(false);
      fetchHoteles();
    } catch (e) { onUpdate('error', e.message); }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await safeFetch(`${API_BASE}/hoteles/borrarHotel`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
      });
      onUpdate('success', 'Hotel borrado');
      fetchHoteles();
    } catch (e) { onUpdate('error', e.message); }
    setDeleteId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => { setEditing(null); setForm({ nombre: '', direccion: '', ciudad_id: '', estrellas: 5, telefono: '', imagen: '' }); setModalOpen(true); }} className="btn-primary">
          <Plus size={20} /> Nuevo Hotel
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
            <thead><tr><th>Nombre</th><th>Dirección</th><th>Estrellas</th><th>Teléfono</th><th>Acciones</th></tr></thead>
            <tbody>
            {hoteles.map(h => (
                <tr key={h.id}>
                    <td>{h.nombre}</td><td>{h.direccion}</td><td>{'⭐'.repeat(h.estrellas)}</td><td>{h.telefono}</td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => { setEditing(h); setForm(h); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(h.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Hotel" : "Nuevo Hotel"}>
        <div className="form-grid">
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" />
            <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} className="input-field" />
            <select value={form.ciudad_id} onChange={e => setForm({...form, ciudad_id: e.target.value})} className="input-field">
                <option value="">Seleccionar Ciudad</option>
                {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <input type="number" max="5" min="1" placeholder="Estrellas" value={form.estrellas} onChange={e => setForm({...form, estrellas: e.target.value})} className="input-field" />
            <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="input-field" />
            <input placeholder="URL Imagen" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} className="input-field" />
            <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
        </div>
      </Modal>

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={executeDelete}
        title="¿Eliminar Hotel?"
        message="Esta acción eliminará el hotel y su información. ¿Continuar?"
      />
    </div>
  );
};

// 3. GESTOR DE HABITACIONES
const HabitacionesManager = ({ onUpdate, onError, hoteles }) => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ hotel_id: '', numero_habitacion: '', tipo_habitacion: '', estatus: 'disponible' });
    
    const [deleteId, setDeleteId] = useState(null);
  
    const fetchHabitaciones = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/habitaciones/mostrarTodasHabitaciones`);
        setHabitaciones(Array.isArray(data) ? data : []);
      } catch (e) { 
        onError('Error cargando habitaciones.');
      }
    };
  
    useEffect(() => { fetchHabitaciones(); }, []);
  
    const handleSubmit = async () => {
      try {
        const hotelIdInt = parseInt(form.hotel_id);
        if (!hotelIdInt) {
             onUpdate('error', 'Debes seleccionar un hotel válido');
             return;
        }

        const payload = { ...form, hotel_id: hotelIdInt };

        if (editing) {
            await safeFetch(`${API_BASE}/habitaciones/actualizarHabitacion`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, id: editing.id })
            });
            if (editing.hotel_id !== hotelIdInt) {
                await safeFetch(`${API_BASE}/habitaciones/actualizarIdHabitacion`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editing.id, hotel_id: hotelIdInt })
                });
            }
        } else {
            await safeFetch(`${API_BASE}/habitaciones/crearHabitacion`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        onUpdate('success', 'Habitación procesada');
        setModalOpen(false);
        fetchHabitaciones();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/habitaciones/borrarHabitacion`, {
          method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
        });
        onUpdate('success', 'Habitación borrada');
        fetchHabitaciones();
      } catch (e) { onUpdate('error', e.message); }
      setDeleteId(null);
    };

    const getHotelName = (id) => {
        if (!hoteles) return `ID: ${id}`;
        const h = hoteles.find(h => h.id === id);
        return h ? h.nombre : `ID: ${id}`;
    };
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => { setEditing(null); setForm({ hotel_id: '', numero_habitacion: '', tipo_habitacion: '', estatus: 'disponible' }); setModalOpen(true); }} className="btn-primary">
            <Plus size={20} /> Nueva Habitación
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th># Habitación</th><th>Hotel</th><th>Tipo</th><th>Estatus</th><th>Acciones</th></tr></thead>
            <tbody>
                {habitaciones.map(hab => (
                <tr key={hab.id}>
                    <td>{hab.numero_habitacion}</td>
                    <td>{getHotelName(hab.hotel_id)}</td>
                    <td>{hab.tipo_habitacion}</td>
                    <td>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: hab.estatus === 0 || hab.estatus === 'disponible' ? '#dcfce7' : '#fee2e2', color: hab.estatus === 0 || hab.estatus === 'disponible' ? '#166534' : '#991b1b', fontSize: '12px' }}>
                            {hab.estatus === 0 || hab.estatus === 'disponible' ? 'Disponible' : 'Ocupada/Mant.'}
                        </span>
                    </td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => { setEditing(hab); setForm(hab); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(hab.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
  
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Habitación" : "Nueva Habitación"}>
          <div className="form-grid">
            <select value={form.hotel_id} onChange={e => setForm({...form, hotel_id: e.target.value})} className="input-field">
                <option value="">Seleccionar Hotel</option>
                {hoteles && hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
            </select>
            <input placeholder="Número de Habitación" value={form.numero_habitacion} onChange={e => setForm({...form, numero_habitacion: e.target.value})} className="input-field" />
            <select value={form.tipo_habitacion} onChange={e => setForm({...form, tipo_habitacion: e.target.value})} className="input-field">
                <option value="">Seleccionar Tipo</option>
                <option value="Sencilla">Sencilla</option>
                <option value="Doble">Doble</option>
                <option value="Suite">Suite</option>
            </select>
            <select value={form.estatus} onChange={e => setForm({...form, estatus: e.target.value})} className="input-field">
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
            </select>
            <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
          </div>
        </Modal>

        <ConfirmationModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={executeDelete}
            title="¿Eliminar Habitación?"
            message="Esta acción eliminará la habitación permanentemente."
        />
      </div>
    );
};

// 4. GESTOR DE TRANSPORTES
const TransportesManager = ({ onUpdate, onError }) => {
    const [transportes, setTransportes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ tipo: 'avion', nombre: '', modelo: '', capacidad: '', asientos_disponibles: '' });
    
    const [deleteId, setDeleteId] = useState(null);
  
    const fetchTransportes = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/transportes/obtenerTodosTransportes`);
        setTransportes(Array.isArray(data) ? data : []);
      } catch (e) { 
        onError('Error cargando transportes.');
      }
    };
  
    useEffect(() => { fetchTransportes(); }, []);
  
    const handleSubmit = async () => {
      try {
        const url = editing ? `${API_BASE}/transportes/actualizarTransporte` : `${API_BASE}/transportes/crearTransporte`;
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, id: editing.id } : form;
        
        await safeFetch(url, {
          method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        
        onUpdate('success', `Transporte ${editing ? 'actualizado' : 'creado'} correctamente`);
        setModalOpen(false);
        fetchTransportes();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/transportes/eliminarTransporte`, {
          method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
        });
        onUpdate('success', 'Transporte borrado');
        fetchTransportes();
      } catch (e) { onUpdate('error', e.message); }
      setDeleteId(null);
    };
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => { setEditing(null); setForm({ tipo: 'avion', nombre: '', modelo: '', capacidad: '', asientos_disponibles: '' }); setModalOpen(true); }} className="btn-primary">
            <Plus size={20} /> Nuevo Transporte
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th>Tipo</th><th>Nombre</th><th>Modelo</th><th>Capacidad</th><th>Asientos Disp.</th><th>Acciones</th></tr></thead>
            <tbody>
                {transportes.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay transportes registrados</td></tr>
                ) : (
                    transportes.map(t => (
                    <tr key={t.id}>
                        <td>{t.tipo}</td><td>{t.nombre}</td><td>{t.modelo}</td><td>{t.capacidad}</td><td>{t.asientos_disponibles}</td>
                        <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-icon edit" onClick={() => { setEditing(t); setForm(t); setModalOpen(true); }}><Edit2 size={16} /></button>
                            <button className="btn-icon delete" onClick={() => setDeleteId(t.id)}><Trash2 size={16} /></button>
                        </div>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Transporte" : "Nuevo Transporte"}>
          <div className="form-grid">
            <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="input-field">
                <option value="avion">Avión</option>
                <option value="camion">Camión</option>
            </select>
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" />
            <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} className="input-field" />
            <input type="number" placeholder="Capacidad Total" value={form.capacidad} onChange={e => setForm({...form, capacidad: e.target.value})} className="input-field" />
            <input type="number" placeholder="Asientos Disponibles" value={form.asientos_disponibles} onChange={e => setForm({...form, asientos_disponibles: e.target.value})} className="input-field" />
            <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
          </div>
        </Modal>

        <ConfirmationModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={executeDelete}
            title="¿Eliminar Transporte?"
            message="Esta acción eliminará el transporte. ¿Estás seguro?"
        />
      </div>
    );
  };

// 5. GESTOR DE USUARIOS
const UsuariosManager = ({ onUpdate, onError }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ usuario: '', correo: '', contra: '', nombre: '', apellido: '', telefono: '' });
    
    const [deleteId, setDeleteId] = useState(null);
  
    const fetchUsuarios = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/usuarios/obtenerTodosUsuarios`);
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (e) { 
        onError('Error cargando usuarios.');
      }
    };
  
    useEffect(() => { fetchUsuarios(); }, []);
  
    const handleSubmit = async () => {
      try {
        const url = editing ? `${API_BASE}/usuarios/actualizarUsuario` : `${API_BASE}/usuarios/crearUsuarios`;
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, id: editing.id } : form;
        
        await safeFetch(url, {
          method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        
        onUpdate('success', `Usuario ${editing ? 'actualizado' : 'creado'} correctamente`);
        setModalOpen(false);
        fetchUsuarios();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/usuarios/eliminarUsuario`, {
          method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
        });
        onUpdate('success', 'Usuario eliminado');
        fetchUsuarios();
      } catch (e) { onUpdate('error', e.message); }
      setDeleteId(null);
    };
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => { setEditing(null); setForm({ usuario: '', correo: '', contra: '', nombre: '', apellido: '', telefono: '' }); setModalOpen(true); }} className="btn-primary">
            <Plus size={20} /> Nuevo Usuario
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th>Usuario</th><th>Correo</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Acciones</th></tr></thead>
            <tbody>
                {usuarios.map(u => (
                <tr key={u.id}>
                    <td style={{ fontWeight: 'bold' }}>{u.usuario}</td>
                    <td>{u.correo}</td><td>{u.nombre}</td><td>{u.apellido}</td><td>{u.telefono}</td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => { setEditing(u); setForm(u); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(u.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Usuario" : "Nuevo Usuario"}>
          <div className="form-grid">
            <input placeholder="Username" value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})} className="input-field" />
            <input type="email" placeholder="Correo" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} className="input-field" />
            {!editing && <input type="password" placeholder="Contraseña" value={form.contra} onChange={e => setForm({...form, contra: e.target.value})} className="input-field" />}
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" />
            <input placeholder="Apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} className="input-field" />
            <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="input-field" />
            <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
          </div>
        </Modal>

        <ConfirmationModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={executeDelete}
            title="¿Eliminar Usuario?"
            message="Esta acción eliminará el usuario permanentemente."
        />
      </div>
    );
  };

// ========== PANEL PRINCIPAL ==========

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('hoteles');
  const [alert, setAlert] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [connectionError, setConnectionError] = useState(false);

  const loadGlobalData = async () => {
    try {
        setConnectionError(false); 
        const dataCiudades = await safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`);
        setCiudades(Array.isArray(dataCiudades) ? dataCiudades : []);
        
        const dataHoteles = await safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`);
        setHoteles(Array.isArray(dataHoteles) ? dataHoteles : []);
        
    } catch (error) {
        console.error("Error cargando datos globales", error);
        setConnectionError(true);
    }
  };

  useEffect(() => { loadGlobalData(); }, [activeTab]); 

  const showAlert = (type, message) => {
    setAlert({ type, message, title: type === 'error' ? 'Error' : 'Éxito' });
  };
  
  const handleChildError = (msg) => {
      console.log(msg); 
      setConnectionError(true);
  };

  const tabs = [
    { id: 'hoteles', label: 'Hoteles', icon: Building2 },
    { id: 'ciudades', label: 'Ciudades', icon: MapPin },
    { id: 'habitaciones', label: 'Habitaciones', icon: Bed },
    { id: 'transportes', label: 'Transportes', icon: Bus },
    { id: 'usuarios', label: 'Usuarios', icon: Users }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Renderizado del nuevo componente Alert */}
      {alert && (
        <Alert 
          type={alert.type} 
          title={alert.title} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', margin: 0, color: '#111827' }}>Panel de Administración</h1>
            <p style={{ color: '#6b7280', marginTop: '4px', margin: 0 }}>Gestión de Agencia de Viajes</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#374151" />
            </div>
            <span style={{ fontWeight: '500', color: '#374151' }}>Admin</span>
        </div>
      </div>
      
      {connectionError && (
        <div style={{ 
            background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', 
            padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '12px',
            justifyContent: 'center'
        }}>
            <WifiOff size={24} />
            <div>
                <strong>Error de Conexión:</strong> No se puede contactar al servidor en <code>{API_BASE}</code>.
                <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
                    1. Verifica que <code>npm run dev</code> (o similar) esté corriendo en el backend.<br/>
                    2. Verifica que el backend esté en el puerto 3000.
                </div>
            </div>
            <button 
                onClick={loadGlobalData} 
                style={{ 
                    marginLeft: '20px', padding: '8px 16px', background: 'white', border: '1px solid #fecaca', 
                    borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    fontWeight: '600', color: '#991b1b'
                }}
            >
                <RefreshCw size={16} /> Reintentar
            </button>
        </div>
      )}

      <div style={{ display: 'flex', maxWidth: '1600px', margin: '0 auto', padding: '40px' }}>
        <div style={{ width: '260px', marginRight: '40px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: isActive ? '#eff6ff' : 'transparent', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', marginBottom: '8px', fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#2563eb' : '#4b5563', transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
            Gestión de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          
          {activeTab === 'hoteles' && <HotelesManager ciudades={ciudades} onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'ciudades' && <CiudadesManager onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'habitaciones' && <HabitacionesManager hoteles={hoteles} onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'transportes' && <TransportesManager onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'usuarios' && <UsuariosManager onUpdate={showAlert} onError={handleChildError} />}
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(400px); } to { opacity: 1; transform: translateX(0); } }
        .custom-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .custom-table th { text-align: left; padding: 16px; border-bottom: 2px solid #f3f4f6; color: #6b7280; font-size: 0.875rem; font-weight: 600; }
        .custom-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: middle; }
        .custom-table tr:last-child td { border-bottom: none; }
        .custom-table tr:hover { background-color: #f9fafb; }
        .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: transform 0.1s; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary.full-width { width: 100%; justify-content: center; margin-top: 10px; }
        .btn-icon { padding: 8px; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-icon.edit { background: #eff6ff; color: #3b82f6; }
        .btn-icon.edit:hover { background: #dbeafe; }
        .btn-icon.delete { background: #fef2f2; color: #dc2626; }
        .btn-icon.delete:hover { background: #fee2e2; }
        .form-grid { display: grid; gap: 16px; }
        .input-field { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #3b82f6; ring: 2px solid #eff6ff; }
      `}</style>
    </div>
  );
};

export default AdminPanel;