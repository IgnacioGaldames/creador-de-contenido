// Ruta: src/sections/cupones/scriptCopiaCupon.ts

export const obtenerScriptCopiaCupon = (mensajeCompartir: string) => {
  const mensajeCompartirSeguro = JSON.stringify(mensajeCompartir);

  return `
<script>
  /**
   * Asistente de Programación: Script Maestro de Cupones (Versión DRY)
   *
   * Objetivo principal: Implementar Single Source of Truth (SSOT).
   * Los datos se definen solo en data-attributes y el JavaScript los inyecta
   * en los elementos visuales al cargar la página.
   */
  document.addEventListener('DOMContentLoaded', () => {

    // --- NUEVA LÓGICA DE INICIALIZACIÓN: INSERTAR DATOS VISUALES AL CARGAR ---
    initializeDisplayData();

    /**
     * @function initializeDisplayData
     * * Recorre todas las tarjetas, lee los data-attributes y rellena los
     * elementos del DOM que estaban vacíos.
     */
    function initializeDisplayData() {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      document.querySelectorAll('.cupon').forEach(card => {

        // 1. Lectura de la Única Fuente de Verdad (data-attributes)
        const codigo = card.dataset.codigo;
        const textoCupon = card.dataset.textoCupon;
        const caducidad = card.dataset.caducidad;
        const legal = card.dataset.legal;

        // Revisar si el cupón está caducado (formato DD-MM-YYYY)
        if (caducidad) {
          const parts = caducidad.split('-');
          if (parts.length === 3) {
            const fechaCaducidad = new Date(parts[2], parts[1] - 1, parts[0]);

            // Si la fecha de caducidad es estrictamente menor a hoy (ya pasó), se esconde.
            if (fechaCaducidad < hoy) {
              // Ocultar el contenedor padre (.col-12) para esconder completamente el área del cupón
              const colContainer = card.closest('.col-12');
              if (colContainer) {
                colContainer.style.display = 'none';
              } else {
                card.style.display = 'none';
              }
              return; // Detener inicialización visual para este cupón caducado
            }
          }
        }

        // 2. Rellenar el Input del Código
        const inputCodigo = card.querySelector('.coupon-code');
        if (inputCodigo && codigo) {
          inputCodigo.value = codigo;
        }

        // 3. Rellenar el Span del Texto de la Oferta
        const spanTexto = card.querySelector('.data-texto-display');
        if (spanTexto && textoCupon) {
          spanTexto.textContent = textoCupon;
        }

        // 4. Rellenar el Contenedor de Vigencia y Legal
        const containerLegal = card.querySelector('.data-vigencia-legal');
        if (containerLegal) {
          let htmlContent = '';

          if (caducidad) {
            htmlContent += \`<small class="d-block text-black gotham-medium"> Válido hasta: \${caducidad} </small>\`;
          }

          if (legal) {
            htmlContent += \`<small class="d-block text-secondary legal-text">\${legal}</small>\`;
          }

          containerLegal.innerHTML = htmlContent;
        }
      });
    }
// ----------------------------------------------------------------

// --- 1. DELEGACIÓN DE EVENTOS PARA TODAS LAS ACCIONES ---
document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  const cardContainer = target.closest('.cupon');
  if (!cardContainer) return;

  // A. MANEJO DE COPIA DE CÓDIGO (Botón individual)
  if (target.dataset.action === 'copy-coupon') {
    event.preventDefault();
    handleCouponCodeCopy(target);
    return;
  }

  // B. MANEJO DE COMPARTIR (Botones WhatsApp / Share)
  const message = buildCouponMessage(cardContainer);

  if (target.classList.contains('btn-whatsapp')) {
    event.preventDefault();
    handleWhatsAppShare(message);
  } else if (target.classList.contains('btn-share')) {
    event.preventDefault();
    handleNativeShareOrCopy(target, message);
  }
});

// --- NUEVO: Clic en el grupo de código para copiar ---
document.addEventListener('click', (event) => {
  const codigoGroup = event.target.closest('.input-group.codigo');
  if (!codigoGroup) return;

  const cardContainer = codigoGroup.closest('.cupon');
  if (!cardContainer) return;

  // Buscar el botón de copia en la misma tarjeta
  const copyButton = cardContainer.querySelector('[data-action="copy-coupon"]');
  if (copyButton) {
    handleCouponCodeCopy(copyButton);
  }
});

// --- 2. LÓGICA DE COPIA DE CÓDIGO DEL CUPÓN ---

async function handleCouponCodeCopy(button) {
  const cardContainer = button.closest('.cupon');
  const couponElement = cardContainer.querySelector('.coupon-code');

  if (!couponElement) return;

  // El valor del input ya está garantizado por initializeDisplayData()
  const couponText = (couponElement.value || couponElement.textContent || '').trim();
  if (!couponText) return;

  const textElement = button.querySelector('[data-original-text]');

  // Priorizar API moderna
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(couponText);
      showCopyFeedback(button, textElement, 'btn-light');
      return;
    } catch (err) {
      console.error('Fallo la API de Portapapeles. Intentando fallback execCommand.', err);
    }
  }

  // Fallback: document.execCommand
  if (fallbackCopyTextToClipboard(couponText)) {
    showCopyFeedback(button, textElement, 'btn-light');
  } else {
    console.error('Fallo el método de copia de fallback.');
    alert('¡Ouch! Tu navegador no permite la copia automática. Por favor, copia el texto manualmente: ' + couponText);
  }
}

// --- 3. LÓGICA DE COMPARTIR Y FALLBACK TRIPLE ---

/**
 * @function buildCouponMessage
 * * Esta función ya era DRY, solo lee los atributos y construye el mensaje.
 */
function buildCouponMessage(cardElement) {
  const encabezado = ${mensajeCompartirSeguro};
  const text = cardElement.dataset.textoCupon || '¡Nueva Oferta!';
  const code = cardElement.dataset.codigo || 'CODIGO-NODISPONIBLE';
  const expiry = cardElement.dataset.caducidad || 'Vigencia Desconocida.';
  const legal = cardElement.dataset.legal || 'Aplican T&C.';

  const linkElement = cardElement.querySelector('[data-action="view-products"]');
  const productUrl = linkElement ? window.location.origin + linkElement.getAttribute('href') : window.location.origin;

  return \`
\${encabezado}
\${text}
------------------------------
Código de Cupón: \${code}
Vigencia: \${expiry}
Ver productos: \${productUrl}
------------------------------
\${legal}
        \`.trim();
}

function handleWhatsAppShare(message) {
  const encodedMessage = encodeURIComponent(message);
  const waUrl = \`https://wa.me/?text=\${encodedMessage}\`;
  window.open(waUrl, '_blank');
}

/**
 * @function handleNativeShareOrCopy
 *
 * Implementa la cadena de fallbacks (share -> clipboard -> execCommand)
 */
async function handleNativeShareOrCopy(button, message) {
  const textElement = button.querySelector('.btn-text');

  // 1. Prioridad: API de Compartir Nativa
  if (navigator.share) {
    try {
      await navigator.share({ text: message, title: '¡Mira este Cupón!' });
      return;
    } catch (error) {
      console.warn('Fallo la API Nativa. Intentando copia al portapapeles.', error);
    }
  }

  // 2. Fallback: Copiar al Portapapeles (API moderna)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(message);
      showCopyFeedback(button, textElement, 'btn-secondary');
      return;
    } catch (err) {
      console.warn('Fallo la copia con navigator.clipboard. Intentando execCommand.', err);
    }
  }

  // 3. Fallback Final: document.execCommand('copy')
  if (fallbackCopyTextToClipboard(message)) {
    showCopyFeedback(button, textElement, 'btn-secondary');
  } else {
    // 4. Fallo Total
    console.error('Asistente de Programación: Fallo todos los métodos de copia.');
    alert('¡Ups! No fue posible copiar el mensaje. Inténtalo manualmente.');
  }
}

// --- 4. FUNCIONES DE UTILIDAD (Feedback y Fallback) ---

function showCopyFeedback(button, textElement, originalClass) {
  const originalText = textElement.getAttribute('data-original-text') || 'copiar mensaje';

  textElement.textContent = 'código copiado';
  button.classList.add('btn-success', 'btn-copied');
  button.classList.remove(originalClass);
  button.disabled = true;

  setTimeout(() => {
    textElement.textContent = originalText;
    button.classList.remove('btn-success', 'btn-copied');
    button.classList.add(originalClass);
    button.disabled = false;
  }, 2500);
}


function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
  });
</script>
  `;
};