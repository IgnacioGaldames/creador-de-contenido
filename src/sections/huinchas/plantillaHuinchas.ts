// src/sections/huinchas/plantillaHuinchas.ts
import cssCrudo from './estilosHuinchas.css?raw';

/**
 * Genera el bloque HTML completo de una huincha (hero banner),
 * respetando la estructura base de huincha.html con imágenes responsive.
 */
export const obtenerHtmlHuincha = (
  rutaImagen: string,
  kvGrafica: string,
  categoriaHtml: string,
  llamadoHtml: string,
  areaDepartamento: string,
  link: string,
  tieneMobile: boolean
): string => {
  const srcsetMobile = tieneMobile
    ? `${rutaImagen}-mob.webp`
    : `${rutaImagen}.webp`;

  return `<!--hero-${kvGrafica.toLowerCase().replace(/\s+/g, '-')}-->
<div class="clp-hero-banner">
  <a href="${link}">
    <picture class="slider-hites">
      <!-- Imagen para móviles (hasta 767px) -->
      <source srcset="${srcsetMobile}" media="(max-width: 767.98px)">
      <!-- Imagen para escritorio (desde 768px en adelante) -->
      <source srcset="${rutaImagen}.webp" media="(min-width: 768px)">
      <!-- Imagen de fallback para navegadores que no soportan <picture> -->
      <img fetchpriority="high" loading="eager" decoding="async" src="${rutaImagen}.webp" class="img-fluid"
        alt="${kvGrafica}- ${categoriaHtml} ${llamadoHtml}" title="${categoriaHtml} ${llamadoHtml}"
        data-department="${areaDepartamento}" data-position="1" data-size="12" data-zone="hero">
    </picture>
  </a>
</div>`;
};

/**
 * Envuelve uno o más bloques de huinchas con la etiqueta <style> inyectada.
 */
export const obtenerHtmlHuinchasCompleto = (bloquesHuinchas: string): string => {
  return `<style>
${cssCrudo}
</style>
${bloquesHuinchas}`;
};
