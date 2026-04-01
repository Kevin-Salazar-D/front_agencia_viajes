import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";

//constantes
import icons from "@/constants/icons";
// Modales
import Verify2FAModal from "@/components/modal/Verify2FAModal";
// Servicio y Hook
import AuthService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlerContext";

// Estilos limpios y encapsulados
import "@/styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error, success, warning } = useAlert();

  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [show2FA, setShow2FA] = useState(false);
  const [userId2FA, setUserId2FA] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateLoginForm = (email, password) => {
    const newErrors = {};
    if (!email) newErrors.correo = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.correo = "Correo electrónico inválido";
    if (!password) newErrors.contrasena = "La contraseña es obligatoria";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateLoginForm(
      formData.correo,
      formData.contrasena,
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const datosParaBackend = {
        correo: formData.correo,
        contra: formData.contrasena,
        usuario: formData.correo,
      };

      const response = await AuthService.login(
        datosParaBackend.correo,
        datosParaBackend.correo,
        datosParaBackend.contra,
      );

      const { usuario } = response;

      if (response.requiere2FA) {
        warning("Advertencia", response.mensaje);
        setUserId2FA(response.userId);
        setShow2FA(true);
        setLoading(false);
        return;
      }

      login(usuario);

      //mandamos la alerta al entrar la cuenta
      success("Login exitoso. ", "Has entrando a tu cuenta correctamente");
      navigate("/");
    } catch (errorLogin) {
      console.error("Error en login:", errorLogin);
      setApiError("Correo o contraseña incorrectos. Verifica tus datos.");
      error("Error. ", "Correo o contraseña incorrectos. Verifica tus datos.");

      login(null);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    // CAMBIO CLAVE: Usamos auth-wrapper
    <div className="auth-wrapper">
      <div className="auth-content">
        {/* Lado izquierdo - Imagen/Branding */}
        <div className="auth-side">
          <div className="auth-side-content">
            <div className="auth-logo">
              <div className="logo-icon">
               {icons.locationBig}
              </div>
              <span className="logo-text">ViajesFácil</span>
            </div>
            <h2>Bienvenido de vuelta</h2>
            <p>
              Ingresa a tu cuenta para continuar planeando tu próxima aventura
            </p>
            <div className="auth-features">
              <div className="feature-item">✓ Acceso a ofertas exclusivas</div>
              <div className="feature-item">✓ Historial de reservas</div>
              <div className="feature-item">✓ Pagos seguros</div>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="auth-form-container">
          <div className="auth-form-content">
            <h1>Iniciar sesión</h1>
            <p className="auth-subtitle">
              ¿No tienes cuenta?{" "}
              <Link to="/crear-cuenta" className="link">
                Regístrate aquí
              </Link>
            </p>

            {apiError && (
              <div className="error-alert">
                 {icons.alertCircle}
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-wrapper">
                  {/* 🌟 ICONO AGREGADO AQUÍ */}
                  <span className="input-icon">{icons.email}</span>
                  <input
                    type="email"
                    name="correo"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? "error" : ""}
                  />
                </div>
                {errors.correo && (
                  <span className="error-message">{errors.correo}</span>
                )}
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrapper">
                  {/* 🌟 ICONO AGREGADO AQUÍ */}
                  <span className="input-icon">{icons.password}</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="contrasena"
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className={errors.contrasena ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? icons.eyeOff : icons.eye}
                  </button>
                </div>
                {errors.contrasena && (
                  <span className="error-message">{errors.contrasena}</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Verificando...</span>
                  </>
                ) : (
                  "Iniciar sesión"
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
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {show2FA && (
        <Verify2FAModal
          userId={userId2FA}
          onSuccess={() => navigate("/")}
          onCancel={() => setShow2FA(false)}
        />
      )}
    </div>
  );
};

export default Login;