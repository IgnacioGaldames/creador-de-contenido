// src/sections/cupones/plantillaCupon.ts
export const obtenerPlantillaCupon = (
  esCarrusel: boolean,
  indice: number,
  departamento: string,
  imagen: string,
  titulo: string,
  llamado: string,
  cupon: string,
  legal: string,
  fechaTermino: string,
  idCatalogo: string,
  link: string
) => {
  const posicion = `CUPON-${String(indice + 1).padStart(2, '0')}`;

  // Aquí es donde editarás el diseño HTML cuando tengas el nuevo
  const contenidoCupon = `<div class="card shadow h-100 border rounded-3 cupon overflow-hidden"
    data-texto-cupon="${llamado} ${titulo}" data-codigo="${cupon}" data-caducidad="${fechaTermino}"
    data-legal="${legal}">
    <div class="card-body bg-gradient-red d-flex align-items-center m-3 py-0 px-1 rounded-3 cupon-recorte">
      <picture>
        <source data-size="mobile" media="(max-width: 767.98px)" srcset="/images/Home/${imagen}?$staticlink$">
        <source data-size="desktop" media="(min-width: 768px)" srcset="/images/Home/${imagen}?$staticlink$">
        <img loading="lazy" decoding="async" src="/images/Home/${imagen}?$staticlink$"
          class="logo-cupon img-fluid w-100 rounded-3 py-3 pl-1" alt="${cupon} ${llamado} ${titulo}"
          title="${cupon} ${llamado} ${titulo}" data-department="${departamento}" data-position="${posicion}"
          data-size="4" data-zone="cuponera" data-test="${idCatalogo}">
      </picture>
      <h5 class="card-title text-white m-0 gotham mx-auto pl-1 fs-15px">${llamado} <br>${titulo}<br></h5>
    </div>
    <div class="card-body mx-0 mx-md-1 px-2">
      <div class="input-group codigo mb-2 button-gtm-cupones">
        <span class="input-group-text gotham-book">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy mr-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" /></svg>
          Código:
        </span>
        <input type="text" class="form-control gotham-bold text-center coupon-code" value="${cupon}" readonly>
      </div>
      <div class="text-muted border-top-0 gotham text-center">
        <p class="m-0 data-vigencia-legal"> </p>
      </div>
    </div>
    <div class="card-text">
      <div class="d-flex flex-column justify-content-between align-items-center">
        <div class="d-flex mb-2">
          <button class="button-gtm-cupones btn btn-sm btn-light rounded-pill border border-gray flex-grow-1 mr-1 mr-md-2 px-md-2 fs-7" data-action="copy-coupon" data-evento="copiar código">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy mr-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" /></svg>
            <span class="gotham-book" data-original-text="copiar código">copiar código</span>
          </button>
          <a href="${link}?icn=cuponera&ici=cupon-black-${idCatalogo}" target="_blank" class="button-gtm-cupones btn btn-sm btn-light rounded-pill border border-gray flex-grow-1 ml-1 ml-md-2 px-md-2 fs-7" data-action="view-products" data-evento="Ver Productos">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag mr-1" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" /></svg>
            <span class="gotham-book">ver productos</span>
          </a>
        </div>
        <div class="d-flex mb-2">
                <button class="d-block d-md-none btn btn-sm btn-success mr-3 btn-whatsapp" data-action="share-whatsapp"
                  data-evento="Compartir Whatsapp" id="btn-WA-CUPON-01">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-whatsapp mr-1" viewBox="0 0 16 16">
                    <path
                      d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  <span class="btn-text">compartir en WA</span>
                </button>
                <button class="button-gtm-cupones btn btn-sm btn-secondary btn-share ml-2 "
                  data-action="btn-share-complete" data-evento="Botón compartir todo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-share mr-1" viewBox="0 0 16 16">
                    <path
                      d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                  </svg>
                  <span class="btn-text">copiar mensaje</span>
                </button>
              </div>
      </div>
    </div>
  </div>`;

  if (esCarrusel) {
    return `\n<div class="slide-mundo destacadoHome px-2">\n${contenidoCupon}\n</div>\n`;
  } else {
    return `\n<div class="col-12 col-md-3 mx-auto mb-4">\n${contenidoCupon}\n</div>\n`;
  }
};