import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
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
    const validationErrors = validateLoginForm(formData.correo, formData.contrasena);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Aquí conectarás con tu API real
      // Por ahora simulo la respuesta
      
      // IMPORTANTE: Reemplaza esto con tu llamada real a la API
      // const response = await fetch('TU_API_URL/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // MOCK DATA - Reemplazar con respuesta real de tu API
      const mockUser = {
        id: 1,
        nombre: 'Usuario Demo',
        correo: formData.correo,
        telefono: '3312345678'
      };
      
      const mockToken = 'mock-jwt-token-12345';
      
      // Guardar usuario en contexto y localStorage
      login(mockUser, mockToken);
      
      // Redirigir al home
      navigate('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      setApiError('Correo o contraseña incorrectos. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Bienvenido de vuelta</h2>
            <p>Ingresa a tu cuenta para continuar planeando tu próxima aventura</p>
            <div className="auth-features">
              <div className="feature-item">✓ Acceso a ofertas exclusivas</div>
              <div className="feature-item">✓ Historial de reservas</div>
              <div className="feature-item">✓ Pagos seguros</div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-container">
          <div className="auth-form-content">
            <h1>Iniciar sesión</h1>
            <p className="auth-subtitle">¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>

            {apiError && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Ingresando...</span>
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>o continúa con</span>
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

export default Login;