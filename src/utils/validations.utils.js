export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isNonEmptyString(email) && emailRegex.test(email.trim());
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isValidBirthDate(fechaNacimiento) {
  if (!fechaNacimiento) return false;

  const fecha = new Date(fechaNacimiento);

  if (Number.isNaN(fecha.getTime())) return false;

  const hoy = new Date();

  const edadMinima = 18;

  const fechaMinima = new Date(hoy.getFullYear() - edadMinima, hoy.getMonth(), hoy.getDate());

  if (fecha > fechaMinima) return false;

  return true;
}
