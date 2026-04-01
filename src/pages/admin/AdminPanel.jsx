import React, { useState, useEffect } from 'react';
import {
  Building2, MapPin, Bed, Bus, Users, Plus, Edit2, Trash2, X, Search,
  Save, AlertCircle, CheckCircle, User, WifiOff, RefreshCw, AlertTriangle,
  BookOpen, Image as ImageIcon, List, DollarSign, Map as MapIcon, ArrowRight,
  Package, CreditCard, Calendar // <--- ¡ASEGÚRATE DE AGREGAR ESTO!
} from 'lucide-react';

// ... resto del código ...

// ========== CONFIGURACIÓN API ==========
const API_BASE = 'http://localhost:3000/agenciaViajes';

// ========== COMPONENTES UI COMPARTIDOS ==========

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

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;
  const maxWidth = size === 'large' ? '900px' : '600px';
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', maxWidth, width: '100%',
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
        <div style={{ margin: '0 auto 16px', width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={28} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', background: '#dc2626', fontWeight: '600', color: 'white', cursor: 'pointer' }}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
};

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
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCiudades = async () => {
    try {
      const data = await safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`);
      setCiudades(Array.isArray(data) ? data : []);
    } catch (e) { onError('Error cargando ciudades.'); }
  };

  useEffect(() => { fetchCiudades(); }, []);

  const handleSubmit = async () => {
    try {
      const url = editing ? `${API_BASE}/ciudades/actualizarCiudad` : `${API_BASE}/ciudades/crearCiudad`;
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      onUpdate('success', `Ciudad ${editing ? 'actualizada' : 'creada'} correctamente`);
      setModalOpen(false);
      fetchCiudades();
    } catch (e) { onUpdate('error', e.message); }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await safeFetch(`${API_BASE}/ciudades/borrarCiudad`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
      onUpdate('success', 'Ciudad borrada');
      fetchCiudades();
    } catch (e) { onUpdate('error', e.message); }
    setDeleteId(null);
  };

  const filteredCiudades = ciudades.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Buscar ciudad..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '35px' }}
            />
        </div>
        <button onClick={() => { setEditing(null); setForm({ nombre: '', pais: '', region: '', codigo_postal: '' }); setModalOpen(true); }} className="btn-primary">
          <Plus size={20} /> Nueva Ciudad
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
            <thead><tr><th>Nombre</th><th>País</th><th>Región</th><th>C.P.</th><th>Acciones</th></tr></thead>
            <tbody>
            {filteredCiudades.map(c => (
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
            {filteredCiudades.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron ciudades.</td></tr>}
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
      <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Ciudad?" message="Esta acción borrará la ciudad permanentemente. ¿Estás seguro?" />
    </div>
  );
};

// 2. GESTOR DE HOTELES (CON INFO EXTENDIDA)
const HotelesManager = ({ onUpdate, onError, ciudades }) => {
  const [hoteles, setHoteles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad_id: '', estrellas: 5, telefono: '', imagen: '' });
  
  const [detailsForm, setDetailsForm] = useState({
    descripcion: '', amenidades: '', politicas: '', check_in: '15:00', check_out: '12:00', 
    precio_noche: '', cancelacion: '', retricciones: '', total_resenas: 0
  });
  const [hasDetails, setHasDetails] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageToDelete, setImageToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHoteles = async () => {
    try {
      const data = await safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`);
      setHoteles(Array.isArray(data) ? data : []);
    } catch (e) { onError('Error cargando hoteles.'); }
  };

  useEffect(() => { fetchHoteles(); }, []);

  const handleSubmit = async () => {
    try {
      const url = editing ? `${API_BASE}/hoteles/actualizarHotel` : `${API_BASE}/hoteles/crearHotel`;
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

      if (editing && editing.ciudad_id !== form.ciudad_id) {
            await safeFetch(`${API_BASE}/hoteles/actualizarCiudadIdHotel`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
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
      await safeFetch(`${API_BASE}/hoteles/borrarHotel`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
      onUpdate('success', 'Hotel borrado');
      fetchHoteles();
    } catch (e) { onUpdate('error', e.message); }
    setDeleteId(null);
  };

  const openDetailsModal = async (hotel) => {
    setSelectedHotel(hotel);
    setActiveTab('info');
    setDetailsForm({
        descripcion: '', amenidades: '', politicas: '', check_in: '15:00', check_out: '12:00', 
        precio_noche: '', cancelacion: '', retricciones: '', total_resenas: 0
    });
    setGalleryImages([]);
    
    try {
        const detailsData = await safeFetch(`${API_BASE}/hotelDetalles/mostrarDetallesDeUnHotel/${hotel.id}`);
        if (detailsData && (detailsData.hotel_id || detailsData.id)) {
            setDetailsForm(detailsData);
            setHasDetails(true);
        } else {
            setHasDetails(false);
        }
    } catch (error) {
        setHasDetails(false);
    }

    try {
        const imagesData = await safeFetch(`${API_BASE}/hotelImagenes/mostrarImagenHotel?hotel_id=${hotel.id}`);
        setGalleryImages(Array.isArray(imagesData) ? imagesData : []);
    } catch (error) {
        console.log("Error cargando imágenes", error);
    }

    setDetailsModalOpen(true);
  };

  const handleSaveDetails = async () => {
      try {
          const url = hasDetails ? `${API_BASE}/hotelDetalles/actualizarDetallesHotel` : `${API_BASE}/hotelDetalles/crearDetallesHotel`;
          const method = hasDetails ? 'PUT' : 'POST';
          const body = { ...detailsForm, hotel_id: selectedHotel.id };
          if (hasDetails) body.id = detailsForm.id;

          await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          onUpdate('success', 'Información detallada guardada');
          setHasDetails(true);
      } catch (error) {
          onUpdate('error', 'Error guardando detalles: ' + error.message);
      }
  };

  const handleAddImage = async () => {
      if (!newImageUrl) return;
      try {
          await safeFetch(`${API_BASE}/hotelImagenes/crearImagenHotel`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hotel_id: selectedHotel.id, url: newImageUrl, orden: galleryImages.length + 1 })
          });
          const imagesData = await safeFetch(`${API_BASE}/hotelImagenes/mostrarImagenHotel?hotel_id=${selectedHotel.id}`);
          setGalleryImages(Array.isArray(imagesData) ? imagesData : []);
          setNewImageUrl('');
          onUpdate('success', 'Imagen agregada');
      } catch (error) {
          onUpdate('error', error.message);
      }
  };

  const handleDeleteImage = async (imgId) => {
      // Aquí el modal de confirmación se maneja con imageToDelete
      setImageToDelete(imgId);
  };

  const executeDeleteImage = async () => {
      if (!imageToDelete) return;
      try {
          await safeFetch(`${API_BASE}/hotelImagenes/borrarImagenHotel`, {
              method: 'DELETE', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: imageToDelete })
          });
          setGalleryImages(prev => prev.filter(img => img.id !== imageToDelete));
          onUpdate('success', 'Imagen eliminada');
      } catch (error) {
          onUpdate('error', error.message);
      }
      setImageToDelete(null);
  };

  const filteredHoteles = hoteles.filter(h => 
    h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Buscar hotel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '35px' }}
            />
        </div>
        <button onClick={() => { setEditing(null); setForm({ nombre: '', direccion: '', ciudad_id: '', estrellas: 5, telefono: '', imagen: '' }); setModalOpen(true); }} className="btn-primary">
          <Plus size={20} /> Nuevo Hotel
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
            <thead><tr><th>Nombre</th><th>Dirección</th><th>Estrellas</th><th>Acciones</th></tr></thead>
            <tbody>
            {filteredHoteles.map(h => (
                <tr key={h.id}>
                    <td>{h.nombre}</td><td>{h.direccion}</td><td>{'⭐'.repeat(h.estrellas)}</td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className="btn-icon" 
                            style={{ background: '#e0e7ff', color: '#4338ca' }} 
                            onClick={() => openDetailsModal(h)} 
                            title="Gestionar Detalles y Galería"
                        >
                            <BookOpen size={16} />
                        </button>
                        <button className="btn-icon edit" onClick={() => { setEditing(h); setForm(h); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(h.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
            ))}
            {filteredHoteles.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron hoteles.</td></tr>}
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
            <input placeholder="URL Imagen Principal" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} className="input-field" />
            <button onClick={handleSubmit} className="btn-primary full-width">Guardar</button>
        </div>
      </Modal>

      <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title={`Gestionar: ${selectedHotel?.nombre}`} size="large">
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <button onClick={() => setActiveTab('info')} style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'info' ? '3px solid #2563eb' : '3px solid transparent', color: activeTab === 'info' ? '#2563eb' : '#6b7280', fontWeight: '600', cursor: 'pointer' }}>
                    <List size={18} style={{ display: 'inline', marginRight: '5px' }} /> Información Detallada
                </button>
                <button onClick={() => setActiveTab('imagenes')} style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'imagenes' ? '3px solid #2563eb' : '3px solid transparent', color: activeTab === 'imagenes' ? '#2563eb' : '#6b7280', fontWeight: '600', cursor: 'pointer' }}>
                    <ImageIcon size={18} style={{ display: 'inline', marginRight: '5px' }} /> Galería de Fotos
                </button>
            </div>

            {activeTab === 'info' && (
                <div className="form-grid">
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Descripción General</label>
                    <textarea placeholder="Describe el hotel..." rows="4" value={detailsForm.descripcion} onChange={e => setDetailsForm({...detailsForm, descripcion: e.target.value})} className="input-field" style={{ resize: 'vertical' }} />
                    
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Amenidades (separadas por comas)</label>
                    <textarea placeholder="Ej: WiFi, Piscina, Gym, Spa..." rows="2" value={detailsForm.amenidades} onChange={e => setDetailsForm({...detailsForm, amenidades: e.target.value})} className="input-field" />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Horarios</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <input placeholder="Check-In" value={detailsForm.check_in} onChange={e => setDetailsForm({...detailsForm, check_in: e.target.value})} className="input-field" />
                                <input placeholder="Check-Out" value={detailsForm.check_out} onChange={e => setDetailsForm({...detailsForm, check_out: e.target.value})} className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Precios y Reseñas</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                                    <input type="number" placeholder="Precio/Noche" value={detailsForm.precio_noche} onChange={e => setDetailsForm({...detailsForm, precio_noche: e.target.value})} className="input-field" style={{ paddingLeft: '30px' }} />
                                </div>
                                <input type="number" placeholder="Total Reseñas" value={detailsForm.total_resenas} onChange={e => setDetailsForm({...detailsForm, total_resenas: e.target.value})} className="input-field" />
                            </div>
                        </div>
                    </div>

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Políticas y Restricciones</label>
                    <textarea placeholder="Políticas del hotel..." rows="2" value={detailsForm.politicas} onChange={e => setDetailsForm({...detailsForm, politicas: e.target.value})} className="input-field" />
                    <textarea placeholder="Restricciones..." rows="2" value={detailsForm.retricciones} onChange={e => setDetailsForm({...detailsForm, retricciones: e.target.value})} className="input-field" />
                    
                    <button onClick={handleSaveDetails} className="btn-primary full-width" style={{ marginTop: '10px' }}><Save size={18} /> {hasDetails ? 'Actualizar Información' : 'Guardar Información'}</button>
                </div>
            )}

            {activeTab === 'imagenes' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Agregar Nueva Imagen</label>
                            <input placeholder="https://ejemplo.com/imagen.jpg" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="input-field" style={{ marginTop: '4px' }} />
                        </div>
                        <button onClick={handleAddImage} className="btn-primary" style={{ height: '42px' }}><Plus size={18} /> Agregar</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                        {galleryImages.map(img => (
                            <div key={img.id} style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <img src={img.url} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => handleDeleteImage(img.id)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220, 38, 38, 0.9)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', padding: '4px' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {galleryImages.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af' }}>No hay imágenes en la galería.</p>}
                    </div>
                </div>
            )}
        </div>
      </Modal>

      <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Hotel?" message="Esta acción eliminará el hotel y su información. ¿Continuar?" />
      <ConfirmationModal isOpen={!!imageToDelete} onClose={() => setImageToDelete(null)} onConfirm={executeDeleteImage} title="¿Eliminar Imagen?" message="Esta imagen se borrará de la galería permanentemente." />
    </div>
  );
};

// 3. GESTOR DE HABITACIONES (CORREGIDO)
const HabitacionesManager = ({ onUpdate, onError, hoteles }) => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    // Estado inicial en texto para el select
    const [form, setForm] = useState({ hotel_id: '', numero_habitacion: '', tipo_habitacion: '', estatus: 'disponible' });
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
  
    const fetchHabitaciones = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/habitaciones/mostrarTodasHabitaciones?t=${Date.now()}`);
        setHabitaciones(Array.isArray(data) ? data : []);
      } catch (e) { onError('Error cargando habitaciones.'); }
    };
  
    useEffect(() => { fetchHabitaciones(); }, []);
  
    const handleSubmit = async () => {
      try {
        const hotelIdInt = parseInt(form.hotel_id);
        if (!hotelIdInt) { onUpdate('error', 'Debes seleccionar un hotel válido'); return; }
        
        // --- CORRECCIÓN AQUÍ: Convertir texto a número para la BD ---
        let estatusInt = 0; // Default disponible
        if (form.estatus === 'ocupado') estatusInt = 1;
        if (form.estatus === 'mantenimiento') estatusInt = 2;

        const payload = { 
            ...form, 
            hotel_id: hotelIdInt,
            estatus: estatusInt // Enviamos el número (0, 1 o 2)
        };

        if (editing) {
            await safeFetch(`${API_BASE}/habitaciones/actualizarHabitacion`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, id: editing.id }) });
            if (editing.hotel_id !== hotelIdInt) {
                await safeFetch(`${API_BASE}/habitaciones/actualizarIdHabitacion`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, hotel_id: hotelIdInt }) });
            }
        } else {
            await safeFetch(`${API_BASE}/habitaciones/crearHabitacion`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        onUpdate('success', 'Habitación procesada');
        setModalOpen(false);
        fetchHabitaciones();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/habitaciones/borrarHabitacion`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
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

    // Helper para mostrar etiqueta bonita en la tabla según el número
    const getEstatusInfo = (valor) => {
        // La BD devuelve números (0, 1, 2) o a veces strings si viene del form
        const val = String(valor); 
        if (val === '1' || val === 'ocupado') return { text: 'Ocupada', bg: '#fee2e2', color: '#991b1b' };
        if (val === '2' || val === 'mantenimiento') return { text: 'Mantenimiento', bg: '#fef3c7', color: '#92400e' };
        return { text: 'Disponible', bg: '#dcfce7', color: '#166534' }; // 0 o default
    };

    const filteredHabitaciones = habitaciones.filter(h => 
      h.numero_habitacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getHotelName(h.hotel_id).toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Buscar habitación..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '35px' }}
            />
          </div>
          <button onClick={() => { setEditing(null); setForm({ hotel_id: '', numero_habitacion: '', tipo_habitacion: '', estatus: 'disponible' }); setModalOpen(true); }} className="btn-primary">
            <Plus size={20} /> Nueva Habitación
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th># Habitación</th><th>Hotel</th><th>Tipo</th><th>Estatus</th><th>Acciones</th></tr></thead>
            <tbody>
                {filteredHabitaciones.map(hab => {
                    const statusInfo = getEstatusInfo(hab.estatus);
                    return (
                        <tr key={hab.id}>
                            <td>{hab.numero_habitacion}</td><td>{getHotelName(hab.hotel_id)}</td><td>{hab.tipo_habitacion}</td>
                            <td>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: statusInfo.bg, color: statusInfo.color, fontSize: '12px', fontWeight: '600' }}>
                                    {statusInfo.text}
                                </span>
                            </td>
                            <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn-icon edit" onClick={() => { 
                                    setEditing(hab); 
                                    // Convertir el número de la BD al texto que espera el Select del formulario
                                    let estatusTexto = 'disponible';
                                    if(hab.estatus === 1) estatusTexto = 'ocupado';
                                    if(hab.estatus === 2) estatusTexto = 'mantenimiento';
                                    
                                    setForm({ ...hab, estatus: estatusTexto }); 
                                    setModalOpen(true); 
                                }}><Edit2 size={16} /></button>
                                <button className="btn-icon delete" onClick={() => setDeleteId(hab.id)}><Trash2 size={16} /></button>
                            </div>
                            </td>
                        </tr>
                    );
                })}
                {filteredHabitaciones.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron habitaciones.</td></tr>}
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
        <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Habitación?" message="Esta acción eliminará la habitación permanentemente." />
      </div>
    );
};

// 4. GESTOR DE TRANSPORTES (CORREGIDO FINAL - CON ID Y PRECIO)
const TransportesManager = ({ onUpdate, onError }) => {
    const [transportes, setTransportes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    // Inicializamos el form incluyendo 'precio'
    const [form, setForm] = useState({ 
        id: '', // Agregamos id al estado inicial para evitar problemas
        tipo: 'avion', 
        nombre: '', 
        modelo: '', 
        capacidad: '', 
        asientos_disponibles: '', 
        precio: '' 
    });
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
  
    const fetchTransportes = async () => {
      try {
        // ?t=... evita el caché del navegador (Error 304)
        const data = await safeFetch(`${API_BASE}/transportes/obtenerTodosTransportes?t=${Date.now()}`);
        setTransportes(Array.isArray(data) ? data : []);
      } catch (e) { onError('Error cargando transportes.'); }
    };
  
    useEffect(() => { fetchTransportes(); }, []);
  
    const handleSubmit = async () => {
      try {
        const url = editing ? `${API_BASE}/transportes/actualizarTransporte` : `${API_BASE}/transportes/crearTransporte`;
        const method = editing ? 'PUT' : 'POST';
        
        // CORRECCIÓN PRINCIPAL: Aseguramos que el ID exista si estamos editando
        const idToUpdate = editing ? (editing.id || form.id) : undefined;

        const body = { 
            ...form, 
            id: idToUpdate, // Enviamos el ID explícitamente
            capacidad: parseInt(form.capacidad) || 0,
            asientos_disponibles: parseInt(form.asientos_disponibles) || 0,
            precio: parseFloat(form.precio) || 0
        };

        // Debug para verificar en consola
        console.log("Enviando transporte:", body);

        await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        onUpdate('success', `Transporte ${editing ? 'actualizado' : 'creado'} correctamente`);
        setModalOpen(false);
        setSearchTerm(''); 
        fetchTransportes();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/transportes/eliminarTransporte`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
        onUpdate('success', 'Transporte borrado');
        fetchTransportes();
      } catch (e) { onUpdate('error', e.message); }
      setDeleteId(null);
    };

    const filteredTransportes = transportes.filter(t => 
      (t.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.modelo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Buscar transporte..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '35px' }}
            />
          </div>
          <button onClick={() => { 
              setEditing(null); 
              setForm({ id: '', tipo: 'avion', nombre: '', modelo: '', capacidad: '', asientos_disponibles: '', precio: '' }); 
              setModalOpen(true); 
            }} className="btn-primary">
            <Plus size={20} /> Nuevo Transporte
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th>Tipo</th><th>Nombre</th><th>Modelo</th><th>Capacidad</th><th>Precio</th><th>Asientos Disp.</th><th>Acciones</th></tr></thead>
            <tbody>
                {filteredTransportes.map(t => (
                    <tr key={t.id}>
                        <td style={{ textTransform: 'capitalize' }}>{t.tipo}</td>
                        <td style={{ fontWeight: '600' }}>{t.nombre}</td>
                        <td>{t.modelo}</td>
                        <td>{t.capacidad} pax</td>
                        <td style={{ fontWeight: 'bold', color: '#059669' }}>${t.precio}</td>
                        <td>{t.asientos_disponibles} libres</td>
                        <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-icon edit" onClick={() => { 
                                // CORRECCIÓN: Cargamos explícitamente el ID en el form al editar
                                setEditing(t); 
                                setForm({
                                    id: t.id,
                                    tipo: t.tipo,
                                    nombre: t.nombre,
                                    modelo: t.modelo,
                                    capacidad: t.capacidad,
                                    asientos_disponibles: t.asientos_disponibles,
                                    precio: t.precio
                                });
                                setModalOpen(true); 
                            }}><Edit2 size={16} /></button>
                            <button className="btn-icon delete" onClick={() => setDeleteId(t.id)}><Trash2 size={16} /></button>
                        </div>
                        </td>
                    </tr>
                ))}
                {filteredTransportes.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron transportes.</td></tr>}
            </tbody>
            </table>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Transporte" : "Nuevo Transporte"}>
          <div className="form-grid">
            <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Datos del Vehículo</label>
            <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="input-field">
                <option value="avion">Avión</option>
                <option value="camion">Camión</option>
            </select>
            <input placeholder="Nombre (Ej: Aeroméxico)" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" />
            <input placeholder="Modelo (Ej: Boeing 737)" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} className="input-field" />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Capacidad Total</span>
                    <input type="number" placeholder="Ej: 50" value={form.capacidad} onChange={e => setForm({...form, capacidad: e.target.value})} className="input-field" />
                </div>
                <div>
                    <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Disponibles</span>
                    <input type="number" placeholder="Ej: 50" value={form.asientos_disponibles} onChange={e => setForm({...form, asientos_disponibles: e.target.value})} className="input-field" />
                </div>
            </div>

            <div>
                <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Precio Base</span>
                <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                    <input type="number" placeholder="0.00" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} className="input-field" style={{ paddingLeft: '30px' }} />
                </div>
            </div>
            
            <button onClick={handleSubmit} className="btn-primary full-width" style={{ marginTop: '10px' }}>Guardar</button>
          </div>
        </Modal>
        <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Transporte?" message="Esta acción eliminará el transporte. ¿Estás seguro?" />
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
    const [searchTerm, setSearchTerm] = useState('');
  
    const fetchUsuarios = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/usuarios/obtenerTodosUsuarios`);
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (e) { onError('Error cargando usuarios.'); }
    };
  
    useEffect(() => { fetchUsuarios(); }, []);
  
    const handleSubmit = async () => {
      try {
        const url = editing ? `${API_BASE}/usuarios/actualizarUsuario` : `${API_BASE}/usuarios/crearUsuarios`;
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, id: editing.id } : form;
        await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        onUpdate('success', `Usuario ${editing ? 'actualizado' : 'creado'} correctamente`);
        setModalOpen(false);
        fetchUsuarios();
      } catch (e) { onUpdate('error', e.message); }
    };
  
    const executeDelete = async () => {
      if (!deleteId) return;
      try {
        await safeFetch(`${API_BASE}/usuarios/eliminarUsuario`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
        onUpdate('success', 'Usuario eliminado');
        fetchUsuarios();
      } catch (e) { onUpdate('error', e.message); }
      setDeleteId(null);
    };

    const filteredUsuarios = usuarios.filter(u => 
      u.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Buscar usuario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '35px' }}
            />
          </div>
          <button onClick={() => { setEditing(null); setForm({ usuario: '', correo: '', contra: '', nombre: '', apellido: '', telefono: '' }); setModalOpen(true); }} className="btn-primary">
            <Plus size={20} /> Nuevo Usuario
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
            <thead><tr><th>Usuario</th><th>Correo</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Acciones</th></tr></thead>
            <tbody>
                {filteredUsuarios.map(u => (
                <tr key={u.id}>
                    <td style={{ fontWeight: 'bold' }}>{u.usuario}</td><td>{u.correo}</td><td>{u.nombre}</td><td>{u.apellido}</td><td>{u.telefono}</td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => { setEditing(u); setForm(u); setModalOpen(true); }}><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => setDeleteId(u.id)}><Trash2 size={16} /></button>
                    </div>
                    </td>
                </tr>
                ))}
                {filteredUsuarios.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron usuarios.</td></tr>}
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
        <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Usuario?" message="Esta acción eliminará el usuario permanentemente." />
      </div>
    );
  };

// 6. GESTOR DE VIAJES (CORREGIDO)
const ViajesManager = ({ onUpdate, onError, ciudades, transportes }) => {
    const [viajes, setViajes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ tipo_transporte_id: '', fecha_salida: '', fecha_llegada: '', origen_ciudad_id: '', destino_ciudad_id: '', numero_transporte: '' });
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchViajes = async () => {
        try {
            const data = await safeFetch(`${API_BASE}/viajes/mostrarTodosLosViajes`);
            setViajes(Array.isArray(data) ? data : []);
        } catch (e) { 
            if (e.message.includes('404')) setViajes([]);
            else onError('Error cargando viajes.'); 
        }
    };

    useEffect(() => { fetchViajes(); }, []);

    const handleSubmit = async () => {
        try {
            if (!form.tipo_transporte_id || !form.origen_ciudad_id || !form.destino_ciudad_id) {
                onUpdate('error', 'Por favor completa todos los campos requeridos');
                return;
            }

            const formatDateForMySQL = (dateString) => {
                if (!dateString) return null;
                return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
            };

            const payload = {
                ...form,
                id: editing ? editing.id : undefined,
                fecha_salida: formatDateForMySQL(form.fecha_salida),
                fecha_llegada: formatDateForMySQL(form.fecha_llegada)
            };

            const url = editing ? `${API_BASE}/viajes/actualizarViaje` : `${API_BASE}/viajes/crearViaje`;
            const method = editing ? 'PUT' : 'POST';
            
            await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            onUpdate('success', `Viaje ${editing ? 'actualizado' : 'programado'} correctamente`);
            setModalOpen(false);
            fetchViajes();
        } catch (e) { onUpdate('error', e.message); }
    };

    const executeDelete = async () => {
        if (!deleteId) return;
        try {
            await safeFetch(`${API_BASE}/viajes/borrarViaje`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
            onUpdate('success', 'Viaje cancelado');
            fetchViajes();
        } catch (e) { onUpdate('error', e.message); }
        setDeleteId(null);
    };

    // Función auxiliar para encontrar ID basado en el nombre (para editar)
    const findCityIdByName = (name) => ciudades.find(c => c.nombre === name)?.id || '';
    const findTransportIdByName = (name) => transportes.find(t => t.nombre === name)?.id || '';

    const filteredViajes = viajes.filter(v =>
        (v.ciudad_origen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.ciudad_destino || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.transporte || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Buscar viaje..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
                <button onClick={() => { setEditing(null); setForm({ tipo_transporte_id: '', fecha_salida: '', fecha_llegada: '', origen_ciudad_id: '', destino_ciudad_id: '', numero_transporte: '' }); setModalOpen(true); }} className="btn-primary">
                    <Plus size={20} /> Programar Viaje
                </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                    <thead><tr><th>Transporte</th><th>Ruta</th><th>Salida</th><th>Llegada</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {filteredViajes.map(v => (
                            <tr key={v.id}>
                                <td>
                                    <div style={{ fontWeight: '600' }}>{v.transporte}</div>
                                    <div style={{ fontSize: '0.8em', color: '#6b7280' }}>#{v.numero_transporte}</div>
                                </td>
                                <td>
                                    {/* CORRECCIÓN: Usamos directamente los nombres que vienen del backend */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                                        {v.ciudad_origen} <ArrowRight size={14} color="#6b7280" /> {v.ciudad_destino}
                                    </div>
                                </td>
                                <td>{new Date(v.fecha_salida).toLocaleString()}</td>
                                <td>{new Date(v.fecha_llegada).toLocaleString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-icon edit" onClick={() => { 
                                            setEditing(v); 
                                            // LOGICA INTELIGENTE: Mapeamos nombres a IDs para el formulario
                                            setForm({
                                                id: v.id,
                                                tipo_transporte_id: v.tipo_transporte_id || findTransportIdByName(v.transporte),
                                                origen_ciudad_id: v.origen_ciudad_id || findCityIdByName(v.ciudad_origen),
                                                destino_ciudad_id: v.destino_ciudad_id || findCityIdByName(v.ciudad_destino),
                                                numero_transporte: v.numero_transporte,
                                                fecha_salida: v.fecha_salida,
                                                fecha_llegada: v.fecha_llegada
                                            }); 
                                            setModalOpen(true); 
                                        }}><Edit2 size={16} /></button>
                                        <button className="btn-icon delete" onClick={() => setDeleteId(v.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredViajes.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron viajes.</td></tr>}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Reprogramar Viaje" : "Programar Nuevo Viaje"}>
                <div className="form-grid">
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Transporte y Ruta</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select value={form.tipo_transporte_id} onChange={e => setForm({...form, tipo_transporte_id: parseInt(e.target.value)})} className="input-field">
                            <option value="">Transporte...</option>
                            {transportes.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.tipo})</option>)}
                        </select>
                        <input placeholder="Num. Vuelo/Bus" value={form.numero_transporte} onChange={e => setForm({...form, numero_transporte: e.target.value})} className="input-field" />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select value={form.origen_ciudad_id} onChange={e => setForm({...form, origen_ciudad_id: parseInt(e.target.value)})} className="input-field">
                            <option value="">Origen...</option>
                            {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                        <select value={form.destino_ciudad_id} onChange={e => setForm({...form, destino_ciudad_id: parseInt(e.target.value)})} className="input-field">
                            <option value="">Destino...</option>
                            {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151', marginTop: '10px' }}>Horarios</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Salida</span>
                            <input type="datetime-local" value={form.fecha_salida ? new Date(form.fecha_salida).toISOString().slice(0, 16) : ''} onChange={e => setForm({...form, fecha_salida: e.target.value})} className="input-field" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Llegada</span>
                            <input type="datetime-local" value={form.fecha_llegada ? new Date(form.fecha_llegada).toISOString().slice(0, 16) : ''} onChange={e => setForm({...form, fecha_llegada: e.target.value})} className="input-field" />
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="btn-primary full-width" style={{ marginTop: '15px' }}>Guardar Viaje</button>
                </div>
            </Modal>
            <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Cancelar Viaje?" message="Esta acción eliminará el viaje programado." />
        </div>
    );
};

// 7. GESTOR DE PAQUETES (CORREGIDO)
const PaquetesManager = ({ onUpdate, onError, ciudades, hoteles, transportes }) => {
    const [paquetes, setPaquetes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        transporte_id: '', ciudad_id: '', tipo_paquete: '', descripcion: '',
        precio: '', fecha_inicio: '', fecha_fin: '', tiempo_estadia: '', hotel_id: ''
    });
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPaquetes = async () => {
        try {
            const data = await safeFetch(`${API_BASE}/paquetes/mostrarTodosPaquetes`);
            setPaquetes(Array.isArray(data) ? data : []);
        } catch (e) { 
            // Si devuelve 404 es porque no hay paquetes, seteamos array vacío y no mostramos error crítico
            if (e.message.includes('404')) {
                setPaquetes([]);
            } else {
                onError('Error cargando paquetes: ' + e.message);
            }
        }
    };

    useEffect(() => { fetchPaquetes(); }, []);

    const handleSubmit = async () => {
        try {
            // Validaciones básicas
            if (!form.ciudad_id || !form.hotel_id || !form.transporte_id) {
                onUpdate('error', 'Ciudad, Hotel y Transporte son obligatorios');
                return;
            }

            const formatDateForMySQL = (dateString) => {
                if (!dateString) return null;
                return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
            };

            const payload = {
                ...form,
                precio: parseFloat(form.precio),
                transporte_id: parseInt(form.transporte_id),
                ciudad_id: parseInt(form.ciudad_id),
                hotel_id: parseInt(form.hotel_id),
                
                // --- CORRECCIÓN CRÍTICA AQUÍ ---
                // Convertimos a entero. Si viene vacío o texto invalido, enviamos 0.
                // Esto soluciona el error "Data truncated"
                tiempo_estadia: parseInt(form.tiempo_estadia) || 0,
                
                fecha_inicio: formatDateForMySQL(form.fecha_inicio),
                fecha_fin: formatDateForMySQL(form.fecha_fin)
            };

            if (editing) payload.id = editing.paquete_id || editing.id;

            const url = editing ? `${API_BASE}/paquetes/actualizarPaquete` : `${API_BASE}/paquetes/crearPaquete`;
            const method = editing ? 'PUT' : 'POST';

            await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            onUpdate('success', `Paquete ${editing ? 'actualizado' : 'creado'} correctamente`);
            setModalOpen(false);
            fetchPaquetes();
        } catch (e) { onUpdate('error', e.message); }
    };

    const executeDelete = async () => {
        if (!deleteId) return;
        try {
            await safeFetch(`${API_BASE}/paquetes/borrarPaquete`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) });
            onUpdate('success', 'Paquete eliminado');
            fetchPaquetes();
        } catch (e) { onUpdate('error', e.message); }
        setDeleteId(null);
    };

    const filteredPaquetes = paquetes.filter(p =>
        (p.paquete_descripcion || p.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.ciudad || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Buscar paquete..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
                <button onClick={() => {
                    setEditing(null);
                    setForm({ transporte_id: '', ciudad_id: '', tipo_paquete: '', descripcion: '', precio: '', fecha_inicio: '', fecha_fin: '', tiempo_estadia: '', hotel_id: '' });
                    setModalOpen(true);
                }} className="btn-primary">
                    <Plus size={20} /> Nuevo Paquete
                </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                    <thead><tr><th>Descripción</th><th>Destino / Hotel</th><th>Transporte</th><th>Fechas</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {filteredPaquetes.map(p => (
                            <tr key={p.paquete_id || p.id}>
                                <td>
                                    <div style={{ fontWeight: 'bold' }}>{p.tipo_paquete}</div>
                                    <div style={{ fontSize: '0.85em', color: '#6b7280' }}>{p.paquete_descripcion || p.descripcion}</div>
                                </td>
                                <td>
                                    <div>{p.ciudad}</div>
                                    <div style={{ fontSize: '0.85em', color: '#4b5563' }}>🏨 {p.hotel_nombre}</div>
                                </td>
                                <td>{p.transporte}</td>
                                <td style={{ fontSize: '0.85em' }}>
                                    <div>De: {new Date(p.fecha_inicio).toLocaleDateString()}</div>
                                    <div>A: {new Date(p.fecha_fin).toLocaleDateString()}</div>
                                </td>
                                <td style={{ fontWeight: 'bold', color: '#059669' }}>${p.precio}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-icon edit" onClick={() => {
                                            setEditing(p);
                                            setForm({
                                                transporte_id: p.transporte_id || '',
                                                ciudad_id: p.ciudad_id || '',
                                                hotel_id: p.hotel_id || '',
                                                tipo_paquete: p.tipo_paquete,
                                                descripcion: p.paquete_descripcion || p.descripcion,
                                                precio: p.precio,
                                                fecha_inicio: p.fecha_inicio,
                                                fecha_fin: p.fecha_fin,
                                                tiempo_estadia: p.tiempo_estadia
                                            });
                                            setModalOpen(true);
                                        }}><Edit2 size={16} /></button>
                                        <button className="btn-icon delete" onClick={() => setDeleteId(p.paquete_id || p.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredPaquetes.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron paquetes.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Paquete" : "Nuevo Paquete"}>
                <div className="form-grid">
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Detalles Generales</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input placeholder="Tipo (Ej: Luna de Miel)" value={form.tipo_paquete} onChange={e => setForm({ ...form, tipo_paquete: e.target.value })} className="input-field" />
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                            <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="input-field" style={{ paddingLeft: '30px' }} />
                        </div>
                    </div>
                    <textarea placeholder="Descripción del paquete..." rows="2" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="input-field" />

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Configuración del Viaje</label>
                    <select value={form.ciudad_id} onChange={e => setForm({ ...form, ciudad_id: e.target.value })} className="input-field">
                        <option value="">Seleccionar Ciudad Destino...</option>
                        {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select value={form.hotel_id} onChange={e => setForm({ ...form, hotel_id: e.target.value })} className="input-field">
                            <option value="">Seleccionar Hotel...</option>
                            {hoteles
                                .filter(h => !form.ciudad_id || h.ciudad_id == form.ciudad_id)
                                .map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
                        </select>
                        <select value={form.transporte_id} onChange={e => setForm({ ...form, transporte_id: e.target.value })} className="input-field">
                            <option value="">Seleccionar Transporte...</option>
                            {transportes.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.tipo})</option>)}
                        </select>
                    </div>

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Duración</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Inicio</span>
                            <input type="datetime-local" value={form.fecha_inicio ? new Date(form.fecha_inicio).toISOString().slice(0, 16) : ''} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Fin</span>
                            <input type="datetime-local" value={form.fecha_fin ? new Date(form.fecha_fin).toISOString().slice(0, 16) : ''} onChange={e => setForm({ ...form, fecha_fin: e.target.value })} className="input-field" />
                        </div>
                    </div>
                    
                    {/* --- INPUT CORREGIDO PARA TIEMPO ESTADIA --- */}
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151', marginTop: '5px' }}>Días de Estadía</label>
                    <input 
                        type="number" 
                        min="1"
                        placeholder="Ej: 3" 
                        value={form.tiempo_estadia} 
                        onChange={e => setForm({ ...form, tiempo_estadia: e.target.value })} 
                        className="input-field" 
                    />

                    <button onClick={handleSubmit} className="btn-primary full-width" style={{ marginTop: '15px' }}>Guardar Paquete</button>
                </div>
            </Modal>
            <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Paquete?" message="Se borrará este paquete turístico permanentemente." />
        </div>
    );
};

// 8. GESTOR DE PAGOS (FINAL CORREGIDO)
const PagosManager = ({ onUpdate, onError }) => {
    const [pagos, setPagos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    
    // Estado inicial del formulario
    const [form, setForm] = useState({
        usuario_id: '',
        paquete_id: '',
        reservacion_id: '',
        precio_final: '',
        numero_tarjeta: '',
        cvv: '',
        folio: '',
        estatus: '1' 
    });

    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPagos = async () => {
        try {
            // Se usa el timestamp para evitar la caché del navegador
            const data = await safeFetch(`${API_BASE}/pagos/mostrarTodosPagos?t=${Date.now()}`);
            setPagos(Array.isArray(data) ? data : []);
        } catch (e) {
            // CORRECCIÓN CLAVE: Si es 404 significa lista vacía, no es error grave.
            if (e.message.includes('404') || e.message.includes('No se encontraron')) {
                setPagos([]); 
            } else {
                onError('Error cargando pagos: ' + e.message);
            }
        }
    };

    useEffect(() => { fetchPagos(); }, []);

    const handleSubmit = async () => {
        try {
            // Validaciones
            if (!editing && (!form.folio || !form.precio_final || !form.numero_tarjeta)) {
                onUpdate('error', 'Folio, Precio y Tarjeta son obligatorios');
                return;
            }

            const payload = {
                ...form,
                precio_final: parseFloat(form.precio_final),
                estatus: parseInt(form.estatus),
                // CORRECCIÓN: Enviamos null si los IDs son 0 o vacío para evitar errores de llave foránea
                usuario_id: (form.usuario_id && form.usuario_id != 0) ? parseInt(form.usuario_id) : null,
                paquete_id: (form.paquete_id && form.paquete_id != 0) ? parseInt(form.paquete_id) : null,
                reservacion_id: (form.reservacion_id && form.reservacion_id != 0) ? parseInt(form.reservacion_id) : null
            };

            const url = editing ? `${API_BASE}/pagos/actualizarPago` : `${API_BASE}/pagos/crearPago`;
            const method = editing ? 'PUT' : 'POST';

            await safeFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            onUpdate('success', `Pago ${editing ? 'actualizado' : 'registrado'} correctamente`);
            setModalOpen(false);
            fetchPagos();
        } catch (e) { onUpdate('error', e.message); }
    };

    const executeDelete = async () => {
        if (!deleteId) return;
        try {
            await safeFetch(`${API_BASE}/pagos/borrarPago`, { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id: deleteId }) 
            });
            onUpdate('success', 'Pago eliminado del historial');
            fetchPagos();
        } catch (e) { onUpdate('error', e.message); }
        setDeleteId(null);
    };

    const getEstatusPago = (estatus) => {
        return estatus == 1 
            ? { text: 'Completado', bg: '#dcfce7', color: '#166534' }
            : { text: 'Pendiente', bg: '#fef3c7', color: '#92400e' };
    };

    const filteredPagos = pagos.filter(p =>
        (p.folio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.nombre_usuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.numero_tarjeta || '').includes(searchTerm)
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Buscar por folio, usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
                <button onClick={() => {
                    setEditing(null);
                    // Pre-llenamos folio para facilitar la prueba
                    setForm({ usuario_id: '', paquete_id: '', reservacion_id: '', precio_final: '', numero_tarjeta: '', cvv: '', folio: `FOL-${Date.now()}`, estatus: '1' });
                    setModalOpen(true);
                }} className="btn-primary">
                    <Plus size={20} /> Registrar Pago
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                    <thead><tr><th>Folio</th><th>Usuario / Paquete</th><th>Monto</th><th>Tarjeta</th><th>Estatus</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {filteredPagos.map(p => {
                            const status = getEstatusPago(p.pago_estatus);
                            return (
                                <tr key={p.pago_id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.folio}</td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{p.nombre_usuario || 'Anónimo'}</div>
                                        <div style={{ fontSize: '0.85em', color: '#6b7280' }}>
                                            {p.paquete_descripcion ? `Paq: ${p.paquete_descripcion.substring(0, 20)}...` : 'Sin paquete'}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: '#059669' }}>${p.precio_final}</td>
                                    <td>•••• {p.numero_tarjeta ? p.numero_tarjeta.slice(-4) : '****'}</td>
                                    <td>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: status.bg, color: status.color, fontSize: '12px', fontWeight: '600' }}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-icon edit" onClick={() => {
                                                setEditing(p);
                                                setForm({
                                                    folio: p.folio,
                                                    precio_final: p.precio_final,
                                                    estatus: p.pago_estatus,
                                                    usuario_id: p.usuario_id,
                                                    paquete_id: p.paquete_id,
                                                    reservacion_id: p.reservacion_id,
                                                    numero_tarjeta: p.numero_tarjeta,
                                                    cvv: '***' 
                                                });
                                                setModalOpen(true);
                                            }}><Edit2 size={16} /></button>
                                            <button className="btn-icon delete" onClick={() => setDeleteId(p.pago_id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredPagos.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron pagos registrados.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Actualizar Pago" : "Registrar Nuevo Pago"}>
                <div className="form-grid">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Folio (Único)</span>
                            <input 
                                placeholder="FOL-12345" 
                                value={form.folio} 
                                onChange={e => setForm({ ...form, folio: e.target.value })} 
                                className="input-field" 
                                disabled={!!editing}
                                style={{ backgroundColor: editing ? '#f3f4f6' : 'white' }}
                            />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Monto Final</span>
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                                <input type="number" placeholder="0.00" value={form.precio_final} onChange={e => setForm({ ...form, precio_final: e.target.value })} className="input-field" style={{ paddingLeft: '30px' }} />
                            </div>
                        </div>
                    </div>

                    {!editing && (
                        <>
                            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#1e40af' }}>Datos Bancarios</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                                    <input placeholder="Número de Tarjeta" value={form.numero_tarjeta} onChange={e => setForm({ ...form, numero_tarjeta: e.target.value })} className="input-field" maxLength="16" />
                                    <input placeholder="CVV" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} className="input-field" maxLength="4" type="password" />
                                </div>
                            </div>

                            <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>IDs de Referencia (Opcional)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <input type="number" placeholder="ID Usuario" value={form.usuario_id} onChange={e => setForm({ ...form, usuario_id: e.target.value })} className="input-field" />
                                <input type="number" placeholder="ID Paquete" value={form.paquete_id} onChange={e => setForm({ ...form, paquete_id: e.target.value })} className="input-field" />
                                <input type="number" placeholder="ID Reserva" value={form.reservacion_id} onChange={e => setForm({ ...form, reservacion_id: e.target.value })} className="input-field" />
                            </div>
                        </>
                    )}

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Estado del Pago</label>
                    <select value={form.estatus} onChange={e => setForm({ ...form, estatus: e.target.value })} className="input-field">
                        <option value="1">Completado / Pagado</option>
                        <option value="0">Pendiente / Rechazado</option>
                    </select>

                    <button onClick={handleSubmit} className="btn-primary full-width" style={{ marginTop: '10px' }}>
                        {editing ? 'Actualizar Monto/Estatus' : 'Registrar Pago'}
                    </button>
                </div>
            </Modal>

            <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Eliminar Pago?" message="Se eliminará el registro de este pago permanentemente." />
        </div>
    );
};

// 9. GESTOR DE RESERVACIONES (CORREGIDO ESTATUS 0, 1, 2)
const ReservacionesManager = ({ onUpdate, onError, usuarios, paquetes, habitaciones }) => {
    const [reservaciones, setReservaciones] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    
    // Estado inicial
    const [form, setForm] = useState({
        usuario_id: '',
        paquete_id: '',
        habitacion_id: '',
        fecha_entrada: '',
        fecha_salida: '',
        numero_reserva: '',
        estatus: 'Pendiente' // Mantenemos texto en el form para el Select
    });

    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReservaciones = async () => {
        try {
            const data = await safeFetch(`${API_BASE}/reservaciones/mostrarTodasReservaciones?t=${Date.now()}`);
            setReservaciones(Array.isArray(data) ? data : []);
        } catch (e) {
            if (e.message.includes('404')) setReservaciones([]);
            else onError('Error cargando reservaciones: ' + e.message);
        }
    };

    useEffect(() => { fetchReservaciones(); }, []);

    const handleSubmit = async () => {
        try {
            if (!form.usuario_id || !form.habitacion_id || !form.fecha_entrada || !form.fecha_salida) {
                onUpdate('error', 'Usuario, Habitación y Fechas son obligatorios');
                return;
            }

            const formatDateForMySQL = (dateString) => {
                if (!dateString) return null;
                return new Date(dateString).toISOString().split('T')[0]; 
            };

            // --- CORRECCIÓN AQUÍ: Convertir Texto a Número ---
            // 0: Pendiente, 1: Confirmada, 2: Cancelada
            let estatusInt = 0; 
            if (form.estatus === 'Confirmada') estatusInt = 1;
            if (form.estatus === 'Cancelada') estatusInt = 2;

            const payload = {
                usuario_id: parseInt(form.usuario_id),
                habitacion_id: parseInt(form.habitacion_id),
                paquete_id: form.paquete_id ? parseInt(form.paquete_id) : null,
                fecha_entrada: formatDateForMySQL(form.fecha_entrada),
                fecha_salida: formatDateForMySQL(form.fecha_salida),
                estatus: estatusInt // Enviamos el número
            };

            if (editing) {
                payload.numero_reserva = editing.numero_reserva; 
                await safeFetch(`${API_BASE}/reservaciones/actualizarReservacion`, { 
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(payload) 
                });
            } else {
                payload.fecha_reserva = new Date().toISOString().slice(0, 19).replace('T', ' ');
                await safeFetch(`${API_BASE}/reservaciones/crearReservacion`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(payload) 
                });
            }
            
            onUpdate('success', `Reservación ${editing ? 'actualizada' : 'creada'} correctamente`);
            setModalOpen(false);
            fetchReservaciones();
        } catch (e) { onUpdate('error', e.message); }
    };

    const executeDelete = async () => {
        if (!deleteId) return;
        try {
            const reservaOriginal = reservaciones.find(r => r.numero_reserva === deleteId);
            await safeFetch(`${API_BASE}/reservaciones/borrarReservacion`, { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    numero_reserva: deleteId,
                    habitacion_id: reservaOriginal ? reservaOriginal.habitacion_id : null
                }) 
            });
            onUpdate('success', 'Reservación cancelada');
            fetchReservaciones();
        } catch (e) { onUpdate('error', e.message); }
        setDeleteId(null);
    };

    // Helper para mostrar estatus bonito en la tabla
    const getStatusInfo = (statusVal) => {
        // La BD devuelve 0, 1, 2. Convertimos a string por seguridad.
        const s = String(statusVal);
        if (s === '1') return { label: 'Confirmada', color: '#166534', bg: '#dcfce7' };
        if (s === '2') return { label: 'Cancelada', color: '#991b1b', bg: '#fee2e2' };
        return { label: 'Pendiente', color: '#92400e', bg: '#fef3c7' }; // 0 o default
    };

    const filteredReservaciones = reservaciones.filter(r =>
        (r.numero_reserva || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.nombre_usuario || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Buscar por reserva o usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
                <button onClick={() => {
                    setEditing(null);
                    setForm({ usuario_id: '', paquete_id: '', habitacion_id: '', fecha_entrada: '', fecha_salida: '', estatus: 'Pendiente' });
                    setModalOpen(true);
                }} className="btn-primary">
                    <Plus size={20} /> Nueva Reservación
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                    <thead><tr><th>Reserva #</th><th>Cliente</th><th>Paquete / Habitación</th><th>Fechas</th><th>Estatus</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {filteredReservaciones.map(r => {
                            // Obtenemos el estilo visual basado en el número (0,1,2)
                            const statusInfo = getStatusInfo(r.reservacion_estatus); 
                            
                            return (
                                <tr key={r.reservacion_id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{r.numero_reserva}</td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{r.nombre_usuario}</div>
                                        <div style={{ fontSize: '0.8em', color: '#6b7280' }}>@{r.username}</div>
                                    </td>
                                    <td>
                                        <div>{r.tipo_paquete || 'Sin Paquete'}</div>
                                        <div style={{ fontSize: '0.8em', color: '#4b5563' }}>Hab: {r.numero_habitacion} ({r.tipo_habitacion})</div>
                                    </td>
                                    <td style={{ fontSize: '0.85em' }}>
                                        <div>Entrada: {new Date(r.fecha_entrada).toLocaleDateString()}</div>
                                        <div>Salida: {new Date(r.fecha_salida).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: statusInfo.bg, color: statusInfo.color
                                        }}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-icon edit" onClick={() => {
                                                setEditing(r);
                                                
                                                // --- CORRECCIÓN AL EDITAR ---
                                                // Convertimos el número de la BD (0,1,2) al texto que espera el Select ('Pendiente', etc)
                                                let estatusTexto = 'Pendiente';
                                                if (String(r.reservacion_estatus) === '1') estatusTexto = 'Confirmada';
                                                if (String(r.reservacion_estatus) === '2') estatusTexto = 'Cancelada';

                                                setForm({
                                                    usuario_id: r.usuario_id || '',
                                                    habitacion_id: r.habitacion_id || '',
                                                    paquete_id: r.paquete_id || '',
                                                    fecha_entrada: r.fecha_entrada,
                                                    fecha_salida: r.fecha_salida,
                                                    estatus: estatusTexto // Seteamos el texto correcto
                                                });
                                                setModalOpen(true);
                                            }}><Edit2 size={16} /></button>
                                            <button className="btn-icon delete" onClick={() => setDeleteId(r.numero_reserva)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredReservaciones.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron reservaciones.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modificar Reservación" : "Nueva Reservación"}>
                <div className="form-grid">
                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Cliente y Servicio</label>
                    <select value={form.usuario_id} onChange={e => setForm({...form, usuario_id: e.target.value})} className="input-field">
                        <option value="">Seleccionar Usuario...</option>
                        {usuarios && usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.usuario})</option>)}
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select value={form.paquete_id} onChange={e => setForm({...form, paquete_id: e.target.value})} className="input-field">
                            <option value="">Paquete (Opcional)</option>
                            {paquetes && paquetes.map(p => <option key={p.paquete_id || p.id} value={p.paquete_id || p.id}>{p.tipo_paquete} - ${p.precio}</option>)}
                        </select>
                        <select value={form.habitacion_id} onChange={e => setForm({...form, habitacion_id: e.target.value})} className="input-field">
                            <option value="">Seleccionar Habitación...</option>
                            {habitaciones && habitaciones.map(h => <option key={h.id} value={h.id}>{h.numero_habitacion} ({h.tipo_habitacion})</option>)}
                        </select>
                    </div>

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Vigencia</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Check-In</span>
                            <input type="date" value={form.fecha_entrada ? new Date(form.fecha_entrada).toISOString().split('T')[0] : ''} onChange={e => setForm({...form, fecha_entrada: e.target.value})} className="input-field" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8em', color: '#6b7280' }}>Check-Out</span>
                            <input type="date" value={form.fecha_salida ? new Date(form.fecha_salida).toISOString().split('T')[0] : ''} onChange={e => setForm({...form, fecha_salida: e.target.value})} className="input-field" />
                        </div>
                    </div>

                    <label style={{ fontSize: '0.9em', fontWeight: '600', color: '#374151' }}>Estado</label>
                    <select value={form.estatus} onChange={e => setForm({...form, estatus: e.target.value})} className="input-field">
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>

                    <button onClick={handleSubmit} className="btn-primary full-width" style={{ marginTop: '10px' }}>
                        {editing ? 'Actualizar Reservación' : 'Crear Reservación'}
                    </button>
                </div>
            </Modal>

            <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={executeDelete} title="¿Cancelar Reservación?" message="Se eliminará la reserva. Asegúrate de notificar al cliente." />
        </div>
    );
};
// ========== PANEL PRINCIPAL ==========

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('hoteles');
  const [alert, setAlert] = useState(null);
 
  // Datos Globales necesarios para relaciones
  const [ciudades, setCiudades] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [connectionError, setConnectionError] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [paquetes, setPaquetes] = useState([]); 
  const [habitaciones, setHabitaciones] = useState([]);

  const loadGlobalData = async () => {
    try {
        setConnectionError(false);
        const [dataCiudades, dataHoteles, dataTransportes, dataUsuarios, dataPaquetes, dataHabitaciones] = await Promise.all([
            safeFetch(`${API_BASE}/ciudades/obtenerTodasCiudades`),
            safeFetch(`${API_BASE}/hoteles/mostrarTodosHoteles`),
            safeFetch(`${API_BASE}/transportes/obtenerTodosTransportes`),
            // Agregamos las nuevas cargas:
            safeFetch(`${API_BASE}/usuarios/obtenerTodosUsuarios`),
            safeFetch(`${API_BASE}/paquetes/mostrarTodosPaquetes`),
            safeFetch(`${API_BASE}/habitaciones/mostrarTodasHabitaciones`)
        ]);

        setCiudades(Array.isArray(dataCiudades) ? dataCiudades : []);
        setHoteles(Array.isArray(dataHoteles) ? dataHoteles : []);
        setTransportes(Array.isArray(dataTransportes) ? dataTransportes : []);
        setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
        setPaquetes(Array.isArray(dataPaquetes) ? dataPaquetes : []);
        setHabitaciones(Array.isArray(dataHabitaciones) ? dataHabitaciones : []);
       
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
    { id: 'paquetes', label: 'Paquetes', icon: Package },
    { id: 'transportes', label: 'Transportes', icon: Bus },
    { id: 'viajes', label: 'Viajes', icon: MapIcon },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'reservaciones', label: 'Reservaciones', icon: Calendar },
    { id: 'usuarios', label: 'Usuarios', icon: Users }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {alert && <Alert type={alert.type} title={alert.title} message={alert.message} onClose={() => setAlert(null)} />}

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
            <button onClick={loadGlobalData} style={{ marginLeft: '20px', padding: '8px 16px', background: 'white', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#991b1b' }}>
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
                  {/* Si el icono es undefined (como Package si no se importó), usa un fallback */}
                  {Icon ? <Icon size={20} strokeWidth={isActive ? 2.5 : 2} /> : <div style={{width:20}} />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aquí es donde tu código anterior se cortaba */}
        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
            Gestión de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
         
          {activeTab === 'hoteles' && <HotelesManager ciudades={ciudades} onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'ciudades' && <CiudadesManager onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'habitaciones' && <HabitacionesManager hoteles={hoteles} onUpdate={showAlert} onError={handleChildError} />}
          
          {/* Componente NUEVO de paquetes integrado */}
          {activeTab === 'paquetes' && <PaquetesManager ciudades={ciudades} hoteles={hoteles} transportes={transportes} onUpdate={showAlert} onError={handleChildError} />}
          
          {activeTab === 'transportes' && <TransportesManager onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'viajes' && <ViajesManager onUpdate={showAlert} onError={handleChildError} ciudades={ciudades} transportes={transportes} />}
          {activeTab === 'pagos' && <PagosManager onUpdate={showAlert} onError={handleChildError} />}
          {activeTab === 'reservaciones' && <ReservacionesManager onUpdate={showAlert} onError={handleChildError} usuarios={usuarios} paquetes={paquetes} habitaciones={habitaciones} />}
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