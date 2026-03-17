import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

// Traemos el servicio para la autenticación
import AuthService from "../services/authService";
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlerContext';

// El estilo global para los dos (como el login como el crear cuenta)
import '../styles/Register.css';


const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {error, success} = useAlert();
  
  // Formulario para la creación del usuario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
    telefono: ''
  });
  
  // Estados
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validación interna
  const validateRegisterForm = (data) => {
    const errors = {};
    if (!data.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!data.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
    if (!data.usuario.trim()) errors.usuario = 'El usuario es obligatorio';
    
    if (!data.correo) {
        errors.correo = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(data.correo)) {
        errors.correo = 'Correo electrónico inválido';
    }
    
    if (!data.contrasena) errors.contrasena = 'La contraseña es obligatoria';
    else if (data.contrasena.length < 6) errors.contrasena = 'Mínimo 6 caracteres';
    
    if (data.contrasena !== data.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!data.telefono) errors.telefono = 'El teléfono es obligatorio';
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData); 
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        usuario: formData.usuario,
        correo: formData.correo,
        contra: formData.contrasena,
        telefono: formData.telefono
      };

      const response = await AuthService.createAccount(userData);
      login(response.usuario);
     

      success("Cuenta creada.", "Felicitanciones. Has creado tu cuenta correctamente");
      setTimeout(() => navigate('/'), 2000);
      
    } catch (errorC) {
      console.error('Error en registro:', errorC);
      setApiError(error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.');
      error("Error.", "Error al crear la cuenta. Por favor intenta de nuevo.");

    } finally {
      setLoading(false);
    }
  };

 
  // PANTALLA DE REGISTRO
  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        {/* Lado izquierdo - Imagen/Branding */}
        <div className="auth-side">
          <div className="auth-side-content">
            <div className="auth-logo">
              <div className="logo-icon"><MapPin size={32} /></div>
              <span className="logo-text">ViajesFácil</span>
            </div>
            <h2>Comienza tu aventura</h2>
            <p>Crea tu cuenta y descubre los mejores destinos del mundo</p>
            <div className="auth-features">
              <div className="feature-item">✓ Reserva en segundos</div>
              <div className="feature-item">✓ Ofertas personalizadas</div>
              <div className="feature-item">✓ Atención 24/7</div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-container">
          <div className="auth-form-content">
            <h1>Crear cuenta</h1>
            <p className="auth-subtitle">¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link></p>

            {apiError && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input type="text" name="nombre" placeholder="Juan" value={formData.nombre} onChange={handleChange} className={errors.nombre ? 'error' : ''} />
                  </div>
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input type="text" name="apellido" placeholder="Pérez" value={formData.apellido} onChange={handleChange} className={errors.apellido ? 'error' : ''} />
                  </div>
                  {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Nombre de Usuario</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input type="text" name="usuario" placeholder="juanperez" value={formData.usuario} onChange={handleChange} className={errors.usuario ? 'error' : ''} />
                </div>
                {errors.usuario && <span className="error-message">{errors.usuario}</span>}
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input type="email" name="correo" placeholder="tu@email.com" value={formData.correo} onChange={handleChange} className={errors.correo ? 'error' : ''} />
                </div>
                {errors.correo && <span className="error-message">{errors.correo}</span>}
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={20} />
                  <input type="tel" name="telefono" placeholder="3312345678" value={formData.telefono} onChange={handleChange} className={errors.telefono ? 'error' : ''} maxLength="10" />
                </div>
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input type={showPassword ? 'text' : 'password'} name="contrasena" placeholder="••••••" value={formData.contrasena} onChange={handleChange} className={errors.contrasena ? 'error' : ''} />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
                </div>

                <div className="form-group">
                  <label>Confirmar</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="••••••" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'error' : ''} />
                    <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Acepto los <a href="#" className="link">términos y condiciones</a></span>
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <><span className="spinner"></span> Creando cuenta...</> : 'Crear cuenta'}
              </button>
            </form>

            <div className="auth-divider"><span>o regístrate con</span></div>
            <div className="social-login">
              <button className="social-btn"><img src="https://www.google.com/favicon.ico" alt="Google" /><span>Google</span></button>
              <button className="social-btn"><img src="https://www.facebook.com/favicon.ico" alt="Facebook" /><span>Facebook</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;