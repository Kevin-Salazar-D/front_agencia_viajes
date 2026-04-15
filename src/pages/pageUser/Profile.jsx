import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Flag from "react-world-flags";

import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { useAlert } from "@/context/AlerContext";
import { useModal } from "@/context/ModalConfirmContext";

// Funciones utils
import validateRequiredFields from "@/utils/validateRequiredFields";
import { formatDate } from "@/utils/formatDate";
import getfindFlag from "@/utils/getCountry";

import userService from "@/services/userService";

// Constantes y componentes
import { countries } from "@/constants/flags";
import icons from "@/constants/icons";

import "@/styles/Profile.css";
import ProfilComponent from "@/components/users/Profile";

const Profile = () => {
  const location = useLocation();
  // Detectar pestaña según la URL (punto 1 y 2)
  const isSecurityTab = location.pathname.includes("seguridad");

  // Estado para los datos del usuario
  const [userData, setUserData] = useState(null);

  // Fields válidos para información personal
  const requiredfIelds = [
    "nombre",
    "apellido",
    "usuario",
    "correo",
    "telefono",
  ];

  // Estado para el formulario (incluye campos de contraseña para punto 3)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
    nacionalidad: "",
    password: "",
    confirmPassword: "",
  });

  // Traemos nuestras funciones globales
  const { updateUser, userAuth } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { error, success, warning } = useAlert();
  const { showModal } = useModal();

  // Obtenemos el id del usuario
  const idUser = userAuth?.id;

  // Función para que los inputs puedan escribirse/borrarse
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const LoadData = async () => {
    if (!idUser) return;

    try {
      showLoading("Cargando datos del usuario...");
      const responseData = await userService.getUserByID(idUser);
      const user = responseData.usuario;
      setUserData(user);

      setFormData((prev) => ({
        ...prev,
        nombre: user?.nombre || "",
        apellido: user?.apellido || "",
        usuario: user?.usuario || "",
        correo: user?.correo || "",
        telefono: user?.telefono || "",
        fecha_nacimiento: formatDate(user?.fecha_nacimiento),
        genero: user?.genero || "",
        nacionalidad: user?.nacionalidad || "",
      }));
    } catch (errorM) {
      error(
        "Error",
        "No se pudo traer la información del usuario, inténtelo más tarde.",
      );
    } finally {
      hideLoading();
    }
  };

  // Función para las validaciones del formulario
  const handleValidet = () => {
    // Si estamos en seguridad, validar contraseñas
    if (isSecurityTab) {
      if (!formData.password || !formData.confirmPassword) {
        warning("Campos Vacíos", "Por favor rellena ambos campos de contraseña.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        warning("Error de coincidencia", "Las contraseñas no coinciden.");
        return false;
      }
      return true;
    }

    // Validación normal de información personal
    const { isValid, errorsType } = validateRequiredFields(
      formData,
      requiredfIelds,
    );

    if (errorsType.email === "email_invalid") {
      warning("Correo Inválido", "El formato del correo no es correcto.");
      return false;
    }

    if (errorsType.phone === "phone_invalid") {
      warning("Teléfono Inválido", "El teléfono debe tener exactamente 10 dígitos.");
      return false;
    }

    if (!isValid) {
      warning("Advertencia", "Has dejado campos vacíos obligatorios.");
      return false;
    }
    return true;
  };

  // Función para mandar los datos
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!handleValidet()) return;

    // --- INTEGRACIÓN DEL MODAL PASO A PASO ---
    const isConfirm = await showModal({
      type: "warning",
      title: isSecurityTab ? "¿Actualizar Seguridad?" : "¿Actualizar perfil?",
      message: isSecurityTab 
        ? "Estás a punto de cambiar tu contraseña. Deberás usar la nueva en tu siguiente inicio de sesión."
        : "Estás a punto de modificar tu información personal. Verifica tus datos.",
      confirmText: "Sí, confirmar",
      cancelText: "Cancelar"
    });

    if (!isConfirm) return;

    try {
      showLoading("Actualizando los datos...");

      let dataToSend;

      if (isSecurityTab) {
        // Solo enviamos lo necesario para seguridad
        dataToSend = {
          id: idUser,
          password: formData.password,
        };
      } else {
        // Enviamos información de perfil
        dataToSend = {
          id: idUser,
          usuario: formData.usuario,
          correo: formData.correo,
          nombre: formData.nombre || null,
          apellido: formData.apellido || null,
          telefono: formData.telefono || null,
          genero: formData.genero || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          nacionalidad: formData.nacionalidad
            ? formData.nacionalidad.replace(/["']/g, "")
            : null,
        };
      }

      await userService.updateUser(dataToSend);

      if (!isSecurityTab) {
        // Actualizar contexto solo si es info de perfil
        const updateData = {
          nombre: dataToSend.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          id: idUser,
          telefono: dataToSend.telefono,
          usuario: formData.usuario,
        };
        setUserData(dataToSend);
        updateUser(updateData);
      } else {
        // Limpiar campos de password tras éxito
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      }

      success("Felicidades", "Los cambios se aplicaron correctamente");
    } catch (errorM) {
      let messageError = "Error al procesar los datos, intente más tarde";
      if (errorM.status === 409) {
        messageError = "El Usuario o Correo ya están registrados.";
      }
      error("Error", messageError);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    LoadData();
  }, [idUser, location.pathname]);

  // FUNCION PARA EL RENDERIZADO MINIMALISTA DE LOS DATOS DE DETALLES
  const renderValue = (data, isCountry = false) => {
    if (!data)
      return <span className="info-value empty-value">NO DISPONIBLE</span>;

    const displayLabel = isCountry ? data.name : data;
    const countryCode = isCountry ? data.code : null;

    return (
      <span className="info-value">
        {isCountry && countryCode && (
          <Flag
            code={countryCode}
            style={{
              width: "20px",
              borderRadius: "2px",
              marginRight: "8px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
            fallback={<span style={{ marginRight: "8px" }}></span>}
          />
        )}
        {displayLabel}
      </span>
    );
  };

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <h2>{isSecurityTab ? "Seguridad de la Cuenta" : "Mi Pasaporte Digital"}</h2>
        <p>{isSecurityTab ? "Protege tu cuenta y gestiona tus accesos." : "Gestiona tu información de viajero y preferencias."}</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card user-summary-card">
          <div className="card-cover-banner"></div>
          <div className="card-profile-content">
            <ProfilComponent size="120" direction="column" showInfo={true} />
          </div>
        </div>

        <div className="profile-card user-details-card">
          <div className="details-section">
            <h4 className="section-title">
              {isSecurityTab ? icons.protected : icons.Bigmap} 
              {isSecurityTab ? " AJUSTES DE SEGURIDAD" : " DETALLES DEL VIAJERO"}
            </h4>

            {isSecurityTab ? (
              /* --- PESTAÑA DE SEGURIDAD (Punto 3) --- */
              <form className="edit-profile-form" onSubmit={handleSubmitForm}>
                <div className="form-grid">
                  <div className="form-control">
                    <label>Nueva Contraseña</label>
                    <div className="input-wrapper">
                      <span className="input-icon">{icons.lock}</span>
                      <input
                        type="password"
                        className="custom-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label>Confirmar Contraseña</label>
                    <div className="input-wrapper">
                      <span className="input-icon">{icons.lock}</span>
                      <input
                        type="password"
                        className="custom-input"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                      />
                    </div>
                  </div>
                </div>

                <div className="security-option-card">
                  <div className="option-info">
                    <strong>{icons.protected} Verificación de dos pasos</strong>
                    <p>Aumenta la seguridad de tu cuenta confirmando tu identidad.</p>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-pill ${userAuth?.activacion_dos_pasos === 1 ? 'active' : ''}`}
                    onClick={() => { /* Aquí podrías llamar a una función específica para 2FA si fuera necesario */ }}
                  >
                    {userAuth?.activacion_dos_pasos === 1 ? "Activado" : "Activar ahora"}
                  </button>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Actualizar Seguridad
                  </button>
                </div>
              </form>
            ) : (
              /* --- PESTAÑA DE INFORMACIÓN PERSONAL --- */
              <>
                <div className="minimal-grid">
                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.at} <label>Usuario</label>
                    </div>
                    {renderValue(userData?.usuario)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.email} <label>Correo Electrónico</label>
                    </div>
                    {renderValue(userData?.correo)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.phone} <label>Teléfono Móvil</label>
                    </div>
                    {renderValue(userData?.telefono ? `+52 ${userData.telefono}` : null)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.user} <label>Nombre</label>
                    </div>
                    {renderValue(userData?.nombre)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.user} <label>Apellido</label>
                    </div>
                    {renderValue(userData?.apellido)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.calendar} <label>Nacimiento</label>
                    </div>
                    {renderValue(formatDate(userData?.fecha_nacimiento))}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.users} <label>Género</label>
                    </div>
                    {renderValue(userData?.genero)}
                  </div>

                  <div className="minimal-info-card">
                    <div className="minimal-info-header">
                      {icons.flag} <label>Nacionalidad</label>
                    </div>
                    {renderValue(getfindFlag(userData?.nacionalidad), true)}
                  </div>
                </div>

                <hr className="divider" />

                <div className="details-section">
                  <h4 className="section-title">{icons.BigeditUser} EDITAR PERFIL</h4>
                  <form className="edit-profile-form" onSubmit={handleSubmitForm}>
                    <div className="form-grid">
                      <div className="form-control">
                        <label>Nombre</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.user}</span>
                          <input type="text" className="custom-input" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Apellido</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.user}</span>
                          <input type="text" className="custom-input" name="apellido" value={formData.apellido} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Nombre de Usuario</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.at}</span>
                          <input type="text" className="custom-input" name="usuario" value={formData.usuario} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Correo Electrónico</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.email}</span>
                          <input type="email" className="custom-input" name="correo" value={formData.correo} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Teléfono</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.phone}</span>
                          <input type="tel" className="custom-input" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Fecha de Nacimiento</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.calendar}</span>
                          <input type="date" className="custom-input" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Género</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.users}</span>
                          <select className="custom-input" name="genero" value={formData.genero} onChange={handleChange}>
                            <option value="">Selecciona...</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Nacionalidad</label>
                        <div className="input-wrapper">
                          <span className="input-icon">{icons.flag}</span>
                          <select className="custom-input" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange}>
                            <option value="">Selecciona...</option>
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;