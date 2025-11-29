import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3000/agenciaViajes';

const Register = () => {
  const navigate = useNavigate();
  
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

    const validationErrors = validateRegisterForm(formData); 
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        usuario: formData.usuario,
        correo: formData.correo,
        contra: formData.contrasena,
        telefono: formData.telefono
      };

      const response = await fetch(`${API_BASE}/usuarios/crearUsuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 || (data.error && data.error.includes('Duplicate'))) {
            throw new Error('El usuario o correo ya están registrados.');
        }
        throw new Error(data.error || 'Error al crear la cuenta');
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error en registro:', error);
      setApiError(error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.');
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
        <style>{`
            :root {
              --primary: #2563eb;
              --primary-dark: #1d4ed8;
              --text: #1f2937;
              --text-light: #6b7280;
              --bg: #f3f4f6;
            }
            .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: var(--bg); padding: 2rem; font-family: system-ui, -apple-system, sans-serif; }
            .success-container { background: white; padding: 3rem; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center; }
            .success-icon { color: #10b981; margin-bottom: 1rem; }
            h2 { color: #1f2937; margin-bottom: 0.5rem; }
            p { color: #6b7280; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Lado izquierdo - Imagen/Branding (AZUL IDENTICO A LOGIN) */}
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

              <div className="form-row">
                  <div className="form-group">
                    <label>Contraseña</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="contrasena"
                            placeholder="••••••"
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
                    <label>Confirmar</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="••••••"
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
              </div>

              <div className="form-terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Acepto los <a href="#" className="link">términos y condiciones</a></span>
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

      {/* ESTILOS CSS INTEGRADOS - IDÉNTICOS A LOGIN */}
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
          min-height: 650px;
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

        .auth-side-content { position: relative; z-index: 1; }

        .auth-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 3rem; }
        .logo-icon { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; backdrop-filter: blur(4px); }
        .logo-text { font-size: 1.5rem; font-weight: 700; }

        .auth-side h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }

        .auth-features { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
        .feature-item { background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 12px; backdrop-filter: blur(4px); font-weight: 500; }

        /* Right Side (Form) */
        .auth-form-container { flex: 1.2; padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        .auth-form-content { max-width: 480px; margin: 0 auto; width: 100%; }

        .auth-form-content h1 { font-size: 2rem; color: var(--text); margin-bottom: 0.5rem; }
        .auth-subtitle { color: var(--text-light); margin-bottom: 2rem; }
        .link { color: var(--primary); text-decoration: none; font-weight: 500; }
        .link:hover { text-decoration: underline; }

        .form-group { margin-bottom: 1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .form-group label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text); margin-bottom: 0.5rem; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-light); }

        .auth-form input {
          width: 100%; padding: 12px 14px 12px 44px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 1rem; transition: all 0.2s; box-sizing: border-box;
        }
        .auth-form input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .auth-form input.error { border-color: var(--error); }

        .error-message { color: var(--error); font-size: 0.8rem; margin-top: 4px; display: block; }

        .toggle-password { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-light); cursor: pointer; padding: 0; }

        .btn-submit {
          width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 1rem;
        }
        .btn-submit:hover { background: var(--primary-dark); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-divider { text-align: center; margin: 2rem 0; position: relative; }
        .auth-divider::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #e5e7eb; }
        .auth-divider span { background: white; padding: 0 1rem; color: var(--text-light); position: relative; font-size: 0.9rem; }

        .social-login { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: white; border: 1px solid #e5e7eb; border-radius: 10px; cursor: pointer; font-weight: 500; color: var(--text); transition: background 0.2s; }
        .social-btn:hover { background: #f9fafb; }
        .social-btn img { width: 20px; height: 20px; }

        .error-alert { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }

        @media (max-width: 900px) {
          .auth-side { display: none; }
          .auth-container { padding: 1rem; }
          .auth-content { min-height: auto; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Register;