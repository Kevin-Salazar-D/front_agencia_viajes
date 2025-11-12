// Validar email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar contraseña (mínimo 6 caracteres)
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Validar teléfono (10 dígitos)
export const validatePhone = (phone) => {
  const regex = /^\d{10}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Validar nombre (solo letras y espacios)
export const validateName = (name) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return name.length >= 2 && regex.test(name);
};

// Validar formulario de login
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = 'El correo es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'El correo no es válido';
  }

  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (!validatePassword(password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errors;
};

// Validar formulario de registro
export const validateRegisterForm = (formData) => {
  const errors = {};

  if (!formData.nombre || !validateName(formData.nombre)) {
    errors.nombre = 'El nombre debe tener al menos 2 letras';
  }

  if (!formData.correo) {
    errors.correo = 'El correo es requerido';
  } else if (!validateEmail(formData.correo)) {
    errors.correo = 'El correo no es válido';
  }

  if (!formData.contrasena) {
    errors.contrasena = 'La contraseña es requerida';
  } else if (!validatePassword(formData.contrasena)) {
    errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (formData.contrasena !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!formData.telefono) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!validatePhone(formData.telefono)) {
    errors.telefono = 'El teléfono debe tener 10 dígitos';
  }

  return errors;
};