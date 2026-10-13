// src/sections/huinchas/plantillaHuinchas.ts
import cssCrudo from './estilosHuinchas.css?raw';
import { sentenceCase } from '../../utils/texto';

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
  tieneMobile: boolean,
  legal = ''
): string => {
  const sinImagen = !rutaImagen.trim();
  const srcsetMobile = sinImagen
    ? 'https://placehold.co/360x429'
    : tieneMobile
      ? `${rutaImagen}-mob.webp`
      : `${rutaImagen}.webp`;
  const srcsetDesktop = sinImagen
    ? 'https://placehold.co/1340x411'
    : `${rutaImagen}.webp`;
  const categoriaFormateada = sentenceCase(categoriaHtml);
  const llamadoFormateado = sinImagen ? sentenceCase(llamadoHtml) : llamadoHtml;
  const legalHtml = legal.trim()
    ? `<span class="d-flex justify-content-center text-center fs-10px fs-md-11px mt-0 mt-md-n2">${legal
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')}</span>`
    : '';

  return `<!--hero-${kvGrafica.toLowerCase().replace(/\s+/g, '-')}-->
<div class="clp-hero-banner">
  <a href="${link}">
    <picture class="slider-hites">
      <!-- Imagen para móviles (hasta 767px) -->
      <source srcset="${srcsetMobile}" media="(max-width: 767.98px)">
      <!-- Imagen para escritorio (desde 768px en adelante) -->
      <source srcset="${srcsetDesktop}" media="(min-width: 768px)">
      <!-- Imagen de fallback para navegadores que no soportan <picture> -->
      <img fetchpriority="high" loading="eager" decoding="async" src="${srcsetDesktop}" class="img-fluid"
        alt="${kvGrafica}- ${categoriaFormateada} ${llamadoFormateado}" title="${categoriaFormateada} ${llamadoFormateado}"
        data-department="${areaDepartamento}" data-position="1" data-size="12" data-zone="hero">
    </picture>
  </a>
  ${legalHtml}
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
