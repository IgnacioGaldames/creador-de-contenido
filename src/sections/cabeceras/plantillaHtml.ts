import cssCrudo from './estilosCabeceras.css?raw';

export const obtenerHtmlCabecera = (bloquesImagenes: string, bloquesEnlaces: string): string => {
  // 1. Evaluamos si hay texto en los enlaces
  const tieneEnlaces = bloquesEnlaces.trim() !== '';

  // 2. Si hay enlaces, construimos el bloque HTML con su id="enlaces-wrapper". 
  // Si no hay, devolvemos un texto vacío ('') para que no aparezca.
  const seccionEnlaces = tieneEnlaces
    ? `  <div class="col-12 " id="enlaces-wrapper">
    <div class="recommendation-seach">
      <div class="recommendation-seach-label">
        Los más recomendados:
      </div>
      <div class="recommendation-seach_list-wrapper">
        <div class="recommendation-seach_list">
          <ul class="recommendation-seach_list-inner h-100">
            ${bloquesEnlaces}
          </ul>
        </div>
      </div>
    </div>
  </div>`
    : '';

  const claseJustify = tieneEnlaces ? 'justify-content-md-start' : 'justify-content-md-center';

  // 3. Renderizamos el contenedor principal e inyectamos las variables
  return `<style>
${cssCrudo}
</style>
<section class="cabecera position-relative w-100 pb-6 pb-md-2">
  <div
    class="d-flex flex-nowrap overflow-x-auto scroll-x-touch justify-content-between ${claseJustify} px-2 pb-3 pb-md-2 pt-2 pt-md-1"
    id="cabecera-wrapper">
${bloquesImagenes}
  </div>
${seccionEnlaces}
</section>`;
};

export const obtenerBloqueMarca = (
  tipo: string,
  posicion: string,
  urlImagen: string,
  categoria: string,
  nombreMarca: string,
  linkUrl: string
): string => {
  if (tipo === 'imagen') {
    return `    <a href="${linkUrl}" class="item-circular d-flex flex-column align-items-center flex-shrink-0 text-decoration-none rounded-3 px-1">
      <picture>
        <source data-size='mobile' media='(max-width: 767.98px)' srcset='/${urlImagen}'>
        <source data-size='desktop' media='(min-width: 768px)' srcset='/${urlImagen}'>
        <img 
        loading="lazy" 
        decoding="async" 
        src='/${urlImagen}' 
        class='d-block img-fluid rounded-pill' 
        alt='${nombreMarca}' 
        title='${nombreMarca}' 
        data-position='${posicion}'
        data-department='${categoria}' 
        data-size="1" 
        data-zone="cabeceras"
        >
      </picture>
      <p class="fs-10px fs-md-14px lh-1 mt-1 mb-0 text-dark text-center w-100">${nombreMarca}</p>
    </a>`;
  }

  return `        <li class="recommendation-seach_list-item px-1">
      <a class="recommendation-seach_list-item-anchor btn-recommendation" href="${linkUrl}">
        ${nombreMarca}
      </a>
    </li>`;
};