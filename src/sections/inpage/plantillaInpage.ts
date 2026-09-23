// src/sections/inpage/plantillaInpage.ts
import cssCrudo from './estilosInpage.css?raw';

/**
 * Genera un bloque <picture> para una imagen del inpage.
 */
export const generarBloqueImagen = (
  depto: string,
  sku: string,
  nombreArchivo: string,
  nombreProducto: string,
  marca: string,
  posicion: number
): string => {
  const anioActual = new Date().getFullYear();
  const rutaBase = `images/inpages/${anioActual}/${depto}/${sku}/${nombreArchivo}?$staticlink$`;

  return `          <picture>
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
          </picture>`;
};

/**
 * Genera el HTML completo del inpage con CSS inyectado.
 */
export const generarHtmlInpage = (
  bloquesContenido: string,
  bloquesImagenes: string
): string => {
  return `<style type="text/css">
${cssCrudo}
</style>
<div id="inpage_generico">
  <section class="categoria">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-12 mb-3">
          <!-- contenido -->
${bloquesContenido}

        </div>
        <div class="col-12 ">
          <!-- imagenes -->
${bloquesImagenes}
          <!-- end imagenes -->
        </div>

      </div>
    </div>
  </section>
</div>`;
};
