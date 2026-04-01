export const formatDate = (date) => {
  if (!date) return "";
  
  // Si es un string de MySQL (ej: 2012-06-07T05:00:00.000Z)
  // o un objeto Date, tomamos solo los primeros 10 caracteres.
  const dateString = typeof date === "object" ? date.toISOString() : date;
  
  return dateString.split("T")[0];
};