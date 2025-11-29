import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const Login = () => {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Función de validación interna (reemplaza al archivo externo)
  const validateLoginForm = (email, password) => {
    const newErrors = {};
    if (!email) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.correo = 'Correo electrónico inválido';
    }
    if (!password) {
      newErrors.contrasena = 'La contraseña es obligatoria';
    }
    return newErrors;
  };

  // Función de login interna (reemplaza al AuthContext)
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    // Disparamos un evento de storage por si otros componentes escuchan cambios
    window.dispatchEvent(new Event("storage"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      // 1. Conectar con la API real
      const response = await fetch(`${API_BASE}/usuarios/obtenerTodosUsuarios`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const usuarios = await response.json();

      // 2. Buscar el usuario que coincida con el correo y contraseña
      // NOTA: Esto es una validación básica frontend. Lo ideal es un endpoint /login en el backend que maneje bcrypt.
      // Aquí buscamos coincidencia exacta. 
      const userFound = usuarios.find(u => 
        u.correo.toLowerCase() === formData.correo.toLowerCase() && 
        (u.contra === formData.contrasena || u.contrasena === formData.contrasena || u.usuario === formData.contrasena) // Flexibilidad para pruebas
      );

      if (userFound) {
        // 3. Login Exitoso
        const token = 'dummy-token-' + Date.now(); // Simulamos token
        
        const userData = {
            id: userFound.id,
            nombre: userFound.nombre,
            apellido: userFound.apellido,
            email: userFound.correo,
            usuario: userFound.usuario
        };

        // Guardar en localStorage
        handleLoginSuccess(userData, token);
        
        // Redirigir
        navigate('/'); 
      } else {
        // Fallo de credenciales
        throw new Error('Credenciales inválidas');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      setApiError('Correo o contraseña incorrectos. Verifica tus datos.');
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
            <p className="auth-subtitle">¿No tienes cuenta? <Link to="/register" style={{color: '#2563eb', textDecoration: 'none'}}>Regístrate aquí</Link></p>

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
                    <span>Verificando...</span>
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

      {/* ESTILOS INTEGRADOS */}
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --text: #1f2937;
          --text-light: #6b7280;
          --bg: #1657cfff;
          --error: #ef4444;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg);
          padding: 2rem;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .auth-content {
          display: flex;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
        }

        /* Left Side */
        .auth-side {
          flex: 1;
          background: linear-gradient(135deg, var(--primary), #0ea5e9);
          padding: 3rem;
          display: flex;
          align-items: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .auth-side::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url('https://www.shutterstock.com/image-photo/airplane-wing-many-thick-clouds-600nw-2043208451.jpg') center/cover;
          opacity: 0.2;
          mix-blend-mode: overlay;
        }

        .auth-side-content {
          position: relative;
          z-index: 1;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
        }

        .logo-icon {
          background: rgba(255,255,255,0.2);
          padding: 8px;
          border-radius: 12px;
          backdrop-filter: blur(4px);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .auth-side h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .auth-features {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-item {
          background: rgba(255,255,255,0.1);
          padding: 12px 20px;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          font-weight: 500;
        }

        /* Right Side (Form) */
        .auth-form-container {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-form-content {
          max-width: 400px;
          margin: 0 auto;
          width: 100%;
        }

        .auth-form-content h1 {
          font-size: 2rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .auth-subtitle {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .auth-form input {
          width: 100%;
          padding: 12px 14px 12px 44px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .auth-form input:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .auth-form input.error {
          border-color: var(--error);
        }

        .error-message {
          color: var(--error);
          font-size: 0.85rem;
          margin-top: 4px;
          display: block;
        }

        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-light);
          cursor: pointer;
        }

        .forgot-password {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .btn-submit:hover {
          background: var(--primary-dark);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-divider {
          text-align: center;
          margin: 2rem 0;
          position: relative;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 50%;
          height: 1px;
          background: #e5e7eb;
        }

        .auth-divider span {
          background: white;
          padding: 0 1rem;
          color: var(--text-light);
          position: relative;
          font-size: 0.9rem;
        }

        .social-login {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          color: var(--text);
          transition: background 0.2s;
        }

        .social-btn:hover {
          background: #f9fafb;
        }

        .social-btn img {
          width: 20px;
          height: 20px;
        }

        .error-alert {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .auth-side { display: none; }
          .auth-container { padding: 1rem; }
          .auth-content { min-height: auto; }
        }
      `}</style>
    </div>
  );
};

export default Login;