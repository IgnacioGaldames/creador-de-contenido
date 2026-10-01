// src/utils/fechas.ts

/**
 * Convierte un número de serie de fecha de Excel al formato DD-MM-YYYY.
 * Excel cuenta desde el 1 de enero de 1900, con una corrección de zona horaria.
 * @param numeroSerie - Número de serie de Excel como string (ej. "46595")
 * @returns Fecha formateada "DD-MM-YYYY" o string vacío si el valor no es válido.
 */
export const convertirFechaExcel = (numeroSerie: string): string => {
  const dias = parseInt(numeroSerie, 10);
  if (isNaN(dias)) return '';
  const diasMilisegundos = (dias - 25569) * 86400 * 1000;
  const fecha = new Date(diasMilisegundos);
  const fechaAjustada = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
  const dia = String(fechaAjustada.getDate()).padStart(2, '0');
  const mes = String(fechaAjustada.getMonth() + 1).padStart(2, '0');
  const anio = fechaAjustada.getFullYear();
  return `${dia}-${mes}-${anio}`;
};
