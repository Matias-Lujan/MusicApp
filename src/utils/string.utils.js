export function toCamelCase(str) {
  if (typeof str !== 'string') return str;
  return str.toLowerCase().replace(/[-_ ]+([a-z])/g, (_, letra) => letra.toUpperCase());
}

export function toTitleCase(str) {
  if (typeof str !== 'string') return str;

  return str.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());
}
