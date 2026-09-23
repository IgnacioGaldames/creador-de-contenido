// src/sections/inpage/plantillaInpage.ts
import cssCrudo from './estilosInpage.css?raw';

/**
 * Genera un bloque .col-12 individual con <picture>, <h2> y <p> opcionales.
 */
export const generarBloqueImagen = (
  depto: string,
  sku: string,
  nombreArchivo: string,
  nombreProducto: string,
  marca: string,
  posicion: number,
  titulo: string,
  descripcion: string
): string => {
  const anioActual = new Date().getFullYear();
  const rutaBase = `images/inpages/${anioActual}/${depto}/${sku}/${nombreArchivo}?$staticlink$`;

  const bloqueH2 = titulo.trim()
    ? `\n          <h2>${titulo.trim()}</h2>`
    : '';

  const bloqueP = descripcion.trim()
    ? `\n          <p>${descripcion.trim()}</p>`
    : '';

  return `        <div class="col-12 mb-3">
          <picture>
            <source data-size="mobile" media="(max-width: 767.98px)"
              srcset="${rutaBase}">
            <source data-size="desktop" media="(min-width: 768px)"
              srcset="${rutaBase}">
            <img loading="lazy" decoding="async"
              src="${rutaBase}"
              class="img-fluid w-100 rounded-3"
              alt="${nombreProducto} ${marca}"
              title="${nombreProducto} ${marca}"
              data-department="${depto}" data-position="${posicion}" data-size="12" data-zone="inpage">
          </picture>${bloqueH2}${bloqueP}
        </div>`;
};

/**
 * Genera el HTML completo del inpage con CSS inyectado.
 */
export const generarHtmlInpage = (
  bloquesContenido: string,
  bloquesImagenes: string,
  textoLegal: string
): string => {
  const bloqueContenidoHtml = bloquesContenido.trim()
    ? `        <div class="col-12 mb-3">
          <!-- contenido -->
${bloquesContenido}
        </div>\n`
    : '';

  const bloqueLegalHtml = textoLegal.trim()
    ? `\n        <div class="col-12 mb-3">
          <p class="texto-legal">${textoLegal.trim()}</p>
        </div>`
    : '';

  return `<style type="text/css">
${cssCrudo}
</style>
<div id="inpage_generico">
  <section class="categoria">
    <div class="container">
      <div class="row align-items-center justify-content-center">
${bloqueContenidoHtml}
${bloquesImagenes}
${bloqueLegalHtml}
      </div>
    </div>
  </section>
</div>`;
};
