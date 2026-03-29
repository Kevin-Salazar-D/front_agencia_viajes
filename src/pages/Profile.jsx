import React, { useState } from "react";

function Profile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateName = (e) => {
    e.preventDefault();
    console.log("Nuevo nombre:", name);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log("Password actual:", password);
    console.log("Nueva password:", newPassword);
  };

  return (
    <div className="profile-container">

      {/* ===== EDITAR NOMBRE ===== */}
      <form className="profile-card" onSubmit={handleUpdateName}>
        <div className="profile-header">
          Editar nombre
        </div>

        <div className="profile-body">
          <input
            className="profile-input"
            type="text"
            placeholder="Nuevo nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit" className="profile-btn-primary">
            Guardar cambios
          </button>
        </div>
      </form>

      {/* ===== CAMBIAR PASSWORD ===== */}
      <form className="profile-card" onSubmit={handleChangePassword}>
        <div className="profile-header">
          Cambiar contraseña
        </div>

        <div className="profile-body">
          <input
            className="profile-input"
            type="password"
            placeholder="Contraseña actual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="profile-input"
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" className="profile-btn-secondary">
            Actualizar contraseña
          </button>
        </div>
      </form>

    </div>
  );
}

export default Profile;