const validateRequiredFields = (data, requiredFields) => {
  let errorsType = {};

  const filterField = requiredFields.filter((field) => {
    const value = data[field];
    console.log("Campo actual:", field, "Valor:", value);

    // validar existencia
    if (value === undefined || value === null) return true;

    if (field === "correo" || field === "email" || field === "mail") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() !== "" && !regex.test(value)) {
        errorsType["email"] = "email_invalid";
        return true;
      }
    }

    // validar telefono
    if (field === "phone" || field === "telefono") {
      const regex = /^\d{10}$/;
      if (
        value.toString().trim() !== "" &&
        !regex.test(value.toString().replace(/\s/g, ""))
      ) {
        errorsType["phone"] = "phone_invalid";
        return true;
      }
    }

    // validar contraseña
    if (field === "contrasena" || field === "password" || field === "pass") {
      const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (value.toString().trim() !== "" && !regex.test(value)) {
        errorsType["password"] = "password_invalid";
        return true;
      }
    }

    // ==================================================
    // 🌟 VALIDAR CONFIRMAR CONTRASEÑA (El Blindaje)
    // ==================================================
    if (
      field === "confirmarContrasena" ||
      field === "confirmPassword" ||
      field === "confirmPass"
    ) {
      // 1. Usamos ?? para que respete si la contraseña original es un string vacío ""
      const originalPassword = data["contrasena"] ?? data["password"] ?? data["pass"] ?? "";
      
      console.log("Original: ", originalPassword, "Dato de confirmar:", value);
      
      // 2. Solo marcamos error de "No coinciden" si el usuario YA escribió algo en la confirmación
      if (value.toString().trim() !== "" && originalPassword !== value) {
        // Mantenemos "confirmPassword" como llave para que su Register.jsx lo lea bien
        errorsType["confirmPassword"] = "confirm_password_invalid"; 
        return true;
      }
    }

    // 3. Validar Strings (vacíos o espacios)
    if (typeof value === "string") {
      return value.trim() === "";
    }

    // 4. Validar Números
    if (typeof value === "number") {
      return isNaN(value);
    }

    // 5. Validar Fechas
    if (value instanceof Date) {
      return isNaN(value.getTime());
    }

    return false;
  });

  return {
    isValid: filterField.length === 0,
    filterField,
    errorsType,
  };
};

export default validateRequiredFields;