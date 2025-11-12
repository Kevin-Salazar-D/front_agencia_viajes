import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../services/users';
import { validateRegisterForm } from '../utils/validation';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
    telefono: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validar formulario
    const validationErrors = validateRegisterForm(formData); 
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar (sin confirmPassword)
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        usuario: formData.usuario,
        correo: formData.correo,
        contra: formData.contrasena, // El backend espera 'contra'
        telefono: formData.telefono
      };

      // DEBUG: Ver qué datos se están enviando
      console.log('📤 Datos enviados al backend:', userData);

      // Llamar a tu API
      const response = await createUser(userData);
      
      console.log('Usuario creado:', response);
      
      // Mostrar éxito
      setSuccess(true);
      
      // Opcional: Hacer login automáticamente
      // Si tu API devuelve el usuario y token, puedes hacer:
      // login(response.data.usuario, response.data.token);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setApiError('Este correo ya está registrado');
      } else if (error.response?.status === 500) {
        setApiError('Error en el servidor. Revisa los datos enviados.');
      } else {
        setApiError('Error al crear la cuenta. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="success-container">
          <div className="success-content">
            <CheckCircle size={64} className="success-icon" />
            <h2>¡Cuenta creada exitosamente!</h2>
            <p>Serás redirigido al inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Lado izquierdo - Imagen/Branding */}
        <div className="auth-side">
          <div className="auth-side-content">
            <div className="auth-logo">
              <div className="logo-icon">
                <MapPin size={32} />
              </div>
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
            <p className="auth-subtitle">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>

            {apiError && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Nombre</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? 'error' : ''}
                  />
                </div>
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={errors.apellido ? 'error' : ''}
                  />
                </div>
                {errors.apellido && <span className="error-message">{errors.apellido}</span>}
              </div>

              <div className="form-group">
                <label>Nombre de Usuario</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="usuario"
                    placeholder="juanperez"
                    value={formData.usuario}
                    onChange={handleChange}
                    className={errors.usuario ? 'error' : ''}
                  />
                </div>
                {errors.usuario && <span className="error-message">{errors.usuario}</span>}
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="correo"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'error' : ''}
                  />
                </div>
                {errors.correo && <span className="error-message">{errors.correo}</span>}
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={20} />
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="3312345678"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={errors.telefono ? 'error' : ''}
                    maxLength="10"
                  />
                </div>
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="contrasena"
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className={errors.contrasena ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a></span>
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>o regístrate con</span>
            </div>

            <div className="social-login">
              <button className="social-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                <span>Google</span>
              </button>
              <button className="social-btn">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;