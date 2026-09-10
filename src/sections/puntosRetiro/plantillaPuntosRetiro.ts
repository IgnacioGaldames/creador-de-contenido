// src/sections/puntosRetiro/plantillaPuntosRetiro.ts
import cssCrudo from './estilosPuntosRetiro.css?raw';

export const obtenerPlantillaPuntosRetiro = (jsonTiendas: string) => {
  return `
<style type="text/css">
  ${cssCrudo}
</style>

<div class="" id="retiroentienda">
  <!-- INICIO CABECERA -->
  <section class="header">
    <div class="container px-2 pt-3">
      <div class="row justify-content-center">
        <div class="col-12 text-center">
          <a href="#puntos">
            <picture>
              <source data-size="mobile" media="(max-width: 767.98px)" srcset="images/static/logo-puntoderetiro.svg?$staticlink$">
              <source data-size="desktop" media="(min-width: 768px)" srcset="images/static/logo-puntoderetiro.svg?$staticlink$">
              <img loading="lazy" decoding="async" src="images/static/logo-puntoderetiro.svg?$staticlink$" class="img-fluid w-100 rounded-3 logoretiro" alt="Compra Online con punto de retiro" title="Compra Online con punto de retiro" data-department="generico" data-position="1" data-size="12" data-zone="logo-puntoderetiro">
            </picture>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- FILTROS Y CONTENEDOR DE TIENDAS -->
  <section class="content tiendas" id="puntos">
    <div class="container px-2">
      <div class="row justify-content-center no-gutters">
        <div id="filtros-wrapper" class="w-100">
          <nav class="justify-content-center text-center mx-0 w-100" id="filtros">
            <div class="toolbar row justify-content-center">
              <button class="col-auto btn fil-cat rounded-pill btn-outline-blue px-2 px-md-3 active" data-rel="todas">Todas las zonas</button>
              <button class="col-auto btn fil-cat rounded-pill btn-outline-blue px-2 px-md-3" data-rel="santiago">Santiago (RM)</button>
              <button class="col-auto btn fil-cat rounded-pill btn-outline-blue px-2 px-md-3" data-rel="norte">Norte</button>
              <button class="col-auto btn fil-cat rounded-pill btn-outline-blue px-2 px-md-3" data-rel="centro">Centro</button>
              <button class="col-auto btn fil-cat rounded-pill btn-outline-blue px-2 px-md-3" data-rel="sur">Sur</button>
            </div>
            <div class="toolbar row justify-content-center mb-0">
              <button class="col-auto btn fil-tipo rounded-pill btn-outline-blue px-2 px-md-3 active" data-tipo="todos">Todos los puntos</button>
              <button class="col-auto btn fil-tipo rounded-pill btn-outline-blue px-2 px-md-3" data-tipo="hites">Tiendas Hites</button>
              <button class="col-auto btn fil-tipo rounded-pill btn-outline-blue px-2 px-md-3" data-tipo="starken">Starken</button>
              <button class="col-auto btn fil-tipo rounded-pill btn-outline-blue px-2 px-md-3" data-tipo="blueexpress">Blue Express</button>
            </div>
          </nav>
        </div>
        <div class="col-12 col-md-10 justify-content-center tiendascontent mx-auto mt-4" id="contenedor-tiendas">
          <!-- El contenido se inyecta por Javascript -->
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN PASOS -->
  <section class="content pt-3">
    <div class="container px-2">
      <div class="row justify-content-center pasosretiro">
        <div class="col-12 col-md-10 mb-3">
          <h1 class="m-0 fs-20px">¿Cómo comprar escogiendo un <strong>Punto de Retiro</strong> en Hites.com?</h1>
        </div>
        <div class="col-6 col-sm-3">
          <picture>
            <source data-size="mobile" media="(max-width: 767.98px)" srcset="images/static/paso-01.svg?$staticlink$">
            <source data-size=" desktop" media="(min-width: 768px)" srcset="images/static/paso-01.svg?$staticlink$">
            <img loading="lazy" decoding="async" src="images/static/paso-01.svg?$staticlink$" class="img-fluid rounded-3 puntoderetiro w-60" alt="Paso 1" title="Paso 1" data-department="generico" data-position="1" data-size="3" data-zone="punto-de-retiro">
          </picture>
          <p>Compra en Hites.com y selecciona los productos habilitados con retiro.</p>
        </div>
        <div class="col-6 col-sm-3">
          <picture>
            <source data-size="mobile" media="(max-width: 767.98px)" srcset="images/static/paso-02.svg?$staticlink$">
            <source data-size="desktop" media="(min-width: 768px)" srcset="images/static/paso-02.svg?$staticlink$">
            <img loading="lazy" decoding="async" src="images/static/paso-02.svg?$staticlink$" class="img-fluid rounded-3 puntoderetiro w-60" alt="Paso 2" title="Paso 2" data-department="generico" data-position="2" data-size="3" data-zone="punto-de-retiro">
          </picture>
          <p>Espera el e-mail de confirmación indicando que tu producto está listo para ser retirado.</p>
        </div>
        <div class="col-6 col-sm-3">
          <picture>
            <source data-size="mobile" media="(max-width: 767.98px)" srcset="images/static/paso-03.svg?$staticlink$">
            <source data-size="desktop" media="(min-width: 768px)" srcset="images/static/paso-03.svg?$staticlink$">
            <img loading="lazy" decoding="async" src="images/static/paso-03.svg?$staticlink$" class="img-fluid rounded-3 puntoderetiro w-60" alt="Paso 3" title="Paso 3" data-department="generico" data-position="3" data-size="3" data-zone="punto-de-retiro">
          </picture>
          <p>Retira en el punto seleccionado con tu carnet de identidad y Orden de Flete.</p>
        </div>
        <div class="col-12 col-md-10 text-center mt-3">
          <p>Por políticas de Starken, <strong>si escogiste retiro tercero, se debe presentar un poder simple autorizando a la persona, y fotocopia de carnet de identidad del titular de la compra</strong>, al momento de retirar los productos.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- IMPORTANTE Y FAQ (Simplificado aquí para espacio, pero copia el HTML original de estas secciones) -->
<section class="content" id="importante">
    <div class="container px-2">
      <div class="row justify-content-center importante">
        <div class="col-12 col-md-10 my-3">
          <h2>Importante</h2>
          <ul class="px-2">
            <li>Para retirar tu producto debes presentar tu <strong>cédula de identidad y orden de flete</strong>.</li>
            <li>Por políticas de Starken, <strong>si escogiste retiro tercero, se debe presentar un poder simple
                autorizando a la persona, y fotocopia de carnet de identidad del titular de la compra</strong>, al
              momento de retirar los productos.</li>
            <li>Cuando retires tu producto en tienda es muy importante revisar el producto y firmar un comprobante de
              conformidad.</li>
            <li>Recuerda que tienes un plazo máximo de 4 días para retirar tu producto. Este plazo depende de los días
              de atención del punto seleccionado.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="content" id="preguntas-frcuentes">
    <div class="container px-2">
      <div class="row justify-content-center faq">
        <div class="col-12 col-md-10 my-3">
          <h2>Preguntas Frecuentes</h2>

          <h6 class="accordion-toggle">¿Qué necesito para retirar el producto?</h6>
          <div class="accordion-content">
            <p>Debes ser la persona quien realizó la compra o estar definido como el que retira.</p>
            <p>Debes contar con el número de Orden de Flete de Starken.</p>
            <p>Llevar tu Cédula de Identidad Chilena.</p>
          </div>
          <h6 class="accordion-toggle">¿Puedo ir a buscar mi producto en cualquier momento después de realizar la compra
            en hites.com?</h6>
          <div class="accordion-content">
            <p>Primero debes recibir en tu correo la confirmación de que tu compra esta lista para retiro y luego
              acercarte al punto escogido con los documentos requeridos.</p>
          </div>
          <h6 class="accordion-toggle">¿Quién puede retirar una compra con retiro en un Punto de Retiro?</h6>
          <div class="accordion-content">
            <p>La persona que realiza la compra</p>
            <p>La persona definida como tercero para retirar. Si escoges esta opción, <strong>al momento de retirar la
                persona deberá presentar un poder simple autorizando el retiro y la fotocopia del carnet de identidad
                del titular de la compra</strong>.</p>
          </div>
          <h6 class="accordion-toggle">¿Puedo cambiar la tienda de retiro después de finalizada la compra?</h6>
          <div class="accordion-content">
            <p>Si la compra en hites.com está finalizada, no se podrá cambiar el punto para retirar el producto.</p>
          </div>
          <h6 class="accordion-toggle">¿Cuánto tiempo tengo para retirar mi producto?</h6>
          <div class="accordion-content">
            <p>Si recibiste en tu correo que tu compra esta lista para retirar, tienes 4 días para ir a buscarla.</p>
            <p>Después de los 4 días, los productos se retornarán a hites y se gestionará la anulación de la compra y
              devolución de tu dinero.</p>
          </div>
          <h6 class="accordion-toggle">¿Qué productos se pueden comprar con opción de retiro en tienda?</h6>
          <div class="accordion-content">
            <p>Si el producto que deseas tiene el ícono "Retiro en tienda" habilitado, podrás acceder a esta opción de
              despacho. Si no lo tiene, deberás comprar con la opción de despacho a domicilio.</p>
            <em>* Importante: Hay promociones asociadas que no son válidas para compras con retiro en tienda.</em>
          </div>
          <h6 class="accordion-toggle">¿Puedo en una misma compra tener dos o más productos con diferentes opciones de
            despacho?</h6>
          <div class="accordion-content">
            <p>Cada compra tiene <strong>una opción de despacho</strong>.</p>
            <p>Puedes comprar múltiples productos en una sola compra disponibles para un mismo tipo de despacho.</p>
          </div>
          <h6 class="accordion-toggle">¿Puedo en una misma compra tener dos o más productos con retiro en diferentes
            tiendas?</h6>
          <div class="accordion-content">
            <p><strong>Para retirar en un solo punto</strong> todos tus productos deben estar disponibles en la misma.
            </p>
            <p><strong>Para retirar en diferentes puntos</strong> debes realizar las comprar por separado.</p>
          </div>
          <h6 class="accordion-toggle">¿Necesito llevar la boleta para poder retirar el producto?</h6>
          <div class="accordion-content">
            <p>Sólo necesitas tu Cédula de Identidad y el número de Orden de Flete que se informa en el correo de listo
              para retiro que llegará una vez que tu pedido esté disponible para retirar en el punto seleccionado.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- SCRIPT BASE DE DATOS Y LÓGICA -->
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script type="text/javascript">
  /* 🪄 AQUÍ INYECTAMOS EL JSON GENERADO AUTOMÁTICAMENTE POR REACT */
  const puntosRetiro = ${jsonTiendas};

  let currentZona = "todas";
  let currentTipo = "todos";

  function dibujarTiendas() {
    const contenedor = $("#contenedor-tiendas");
    contenedor.empty();

    const resultados = puntosRetiro.filter(tienda => {
      const okZona = (currentZona === "todas" || tienda.zona === currentZona);
      const okTipo = (currentTipo === "todos" || tienda.tipo === currentTipo);
      return okZona && okTipo;
    });

    if (resultados.length === 0) {
      contenedor.append('<div class="alert alert-light text-center w-100">No hay tiendas disponibles para estos filtros.</div>');
      return;
    }

    resultados.forEach((tienda, index) => {
      let urlLogo = "images/static/hites-store-icon.svg?$staticlink$";
      if (tienda.tipo === "starken") urlLogo = "images/static/starken-store-icon.svg?$staticlink$";
      if (tienda.tipo === "blueexpress") urlLogo = "images/static/bluex-store-icon.svg?$staticlink$";
      const position = index + 1;

      const consultaMapa = encodeURIComponent(tienda.nombre + ' ' + tienda.direccion + ' Chile');
      const mapaDinamico = \`https://www.google.com/maps?q=\${consultaMapa}&output=embed\`;

      const htmlCard = \`
          <div class="boxtiendas tienda-card row align-items-center mb-2 p-2 bg-white">
              <div class="col-2 col-sm-2 px-0 text-center">
                  <img loading="lazy" decoding="async" src="\${urlLogo}" alt="\${tienda.nombre}" title="\${tienda.nombre}" class="img-fluid rounded tienda-logo" data-department="generico" data-position="\${position}" data-size="10" data-zone="puntos-de-retiro">
              </div>
              <div class="col-8 col-sm-7">
                  <p class="mb-1 tienda-nombre"><strong>\${tienda.nombre}</strong></p>
                  <p class="mb-0 text-muted tienda-direccion">\${tienda.direccion}</p>
              </div>
              <div class="col-2 col-sm-3 px-0 text-right">
                <button class="btn btn-outline-blue btn-sm vermapa btn-vermapa lh-1">Ver mapa</button>
              </div>
              <div class="col-12 mapa mapa-container">
                  <div class="mapa-inner">
                      <iframe src="\${mapaDinamico}" width="100%" height="100%" class="mapa-iframe" allowfullscreen loading="lazy"></iframe>
                  </div>
              </div>
          </div>\`;
      contenedor.append(htmlCard);
    });
  }

  $(document).ready(function () {
    dibujarTiendas();

    $(document).on("click", ".vermapa", function () {
      const miMapa = $(this).closest('.boxtiendas').find('.mapa');
      $('.mapa').not(miMapa).slideUp('fast');
      miMapa.slideToggle('slow');
    });

    $(document).on("click", ".accordion-toggle", function () {
      $(this).toggleClass("open").next().slideToggle('fast');
      $(".accordion-toggle").not($(this)).removeClass("open");
      $(".accordion-content").not($(this).next()).slideUp('fast');
    });

    $(".fil-cat").click(function () {
      $(".fil-cat").removeClass('active btn-blue').addClass('btn-outline-blue');
      $(this).removeClass('btn-outline-blue').addClass('active btn-blue');
      currentZona = $(this).attr("data-rel");
      $("#contenedor-tiendas").fadeTo(150, 0.2, function () {
        dibujarTiendas();
        $(this).fadeTo(300, 1);
      });
    });

    $(".fil-tipo").click(function () {
      $(".fil-tipo").removeClass('active btn-blue').addClass('btn-outline-blue');
      $(this).removeClass('btn-outline-blue').addClass('active btn-blue');
      currentTipo = $(this).attr("data-tipo");
      $("#contenedor-tiendas").fadeTo(150, 0.2, function () {
        dibujarTiendas();
        $(this).fadeTo(300, 1);
      });
    });

    /* STICKY MENU */
    const stickyWrapper = $('#filtros-wrapper');
    const navFiltros = $('#filtros');
    if (stickyWrapper.length > 0) {
      $(window).on('scroll', function () {
        const offsetTop = stickyWrapper.offset().top;
        const scrollTop = $(window).scrollTop();
        if (scrollTop >= offsetTop) {
          stickyWrapper.css('min-height', navFiltros.outerHeight() + 'px');
          navFiltros.addClass('fixed-mode');
        } else {
          stickyWrapper.css('min-height', '0');
          navFiltros.removeClass('fixed-mode');
        }
      });
    }
  });
</script>
  `;
};