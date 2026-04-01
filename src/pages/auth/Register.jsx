import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// constantes
import icons from "@/constants/icons";

// Traemos el servicio para la autenticación
import AuthService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlerContext";
//utlis
import validateRequiredFields from "@/utils/validateRequiredFields";
//estilos
import "@/styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error, success, warning } = useAlert();

  const validateFields = [
    "nombre",
    "apellido",
    "usuario",
    "correo",
    "contrasena",
    "confirmarContrasena",
    "telefono",
  ];

  // Formulario para la creación del usuario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    telefono: "",
  });

  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
   
  };

  const handleValidation = () => {
    const { isValid, errorsType } = validateRequiredFields(
      formData,
      validateFields,
    );

    // validamos el campo telefono
    if (errorsType.phone === "phone_invalid") {
      warning(
        "Teléfono Inválido",
        "El teléfono debe tener exactamente 10 dígitos.",
      );
      return false;
    }
    // valkdamos correo
    if (errorsType.email === "email_invalid") {
      warning("Correo invalido", "El correo debe ser valido");
      return false;
    }

    //validamos la contraseña
    if (errorsType.password === "password_invalid") {
      warning(
        "Contraseña invalida",
        "La contraseña debe tener almenos 8 caracteres, mayusculas y un numero ",
      );
      return false;
    }

    //confirmar contraseña

    if (errorsType.confirmPassword === "confirm_password_invalid") {
      warning(
        "Contraseña no coincide", 
        "Las contraseñas deben coincidir");
      return false;
    }

    //validamos que el usuario no dejo un campo importante vacio
     if (!isValid) {
      warning("Advertencia", "Has dejado campos vacíos obligatorios.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validamos nuestro formulario
     if(!handleValidation()) return;

    setLoading(true);
     try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        usuario: formData.usuario,
        correo: formData.correo,
        contra: formData.contrasena,
        telefono: formData.telefono,
      };

      const response = await AuthService.createAccount(userData);
      login(response.usuario);

      success(
        "Cuenta creada.",
        "Felicitanciones. Has creado tu cuenta correctamente",
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (errorC) {
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
              <div className="logo-icon">{icons.locationBig}</div>
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
            <p className="auth-subtitle">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="link">
                Inicia sesión
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.user}</span>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Juan"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.user}</span>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <div className="input-wrapper">
                  <span className="input-icon">{icons.at}</span>
                  <input
                    type="text"
                    name="usuario"
                    placeholder="juanperez"
                    value={formData.usuario}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-wrapper">
                  <span className="input-icon">{icons.email}</span>
                  <input
                    type="email"
                    name="correo"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <div className="input-wrapper">
                  <span className="input-icon">{icons.phone}</span>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="3312345678"
                    value={formData.telefono}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.password}</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="contrasena"
                      placeholder="••••••"
                      value={formData.contrasena}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? icons.eyeoff : icons.eye}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirmar</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.password}</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmarContrasena"
                      placeholder="••••••"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? icons.eyeoff : icons.eyeoff}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    Acepto los{" "}
                    <a href="#" className="link">
                      términos y condiciones
                    </a>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
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
    </div>
  );
};
export default Register;