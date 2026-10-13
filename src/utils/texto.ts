// src/utils/texto.ts

/**
 * Convierte un string a formato "Sentence case":
 * primera letra en mayúscula y el resto en minúscula.
 * Ej: "CELULARES" → "Celulares" | "hasta 55% DSCTO" → "Hasta 55% dscto"
 */
export const sentenceCase = (texto: string): string => {
  if (!texto) return '';
  const limpio = texto.trim();
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
};
