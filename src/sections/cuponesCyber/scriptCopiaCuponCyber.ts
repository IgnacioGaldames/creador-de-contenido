// src/sections/cuponesCyber/scriptCopiaCuponCyber.ts

export const obtenerScriptCopiaCuponCyber = (mensajeCompartir: string) => {
  const mensajeCompartirSeguro = JSON.stringify(mensajeCompartir);

  return `
<script>
  /**
   * Script Maestro de Cupones Cyber (Versión DRY)
   * Single Source of Truth (SSOT): los datos viven en data-attributes.
   */
  document.addEventListener('DOMContentLoaded', () => {

    initializeDisplayData();

    function initializeDisplayData() {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      document.querySelectorAll('.cupon').forEach(card => {
        const codigo = card.dataset.codigo;
        const textoCupon = card.dataset.textoCupon;
        const caducidad = card.dataset.caducidad;
        const legal = card.dataset.legal;

        if (caducidad) {
          const parts = caducidad.split('-');
          if (parts.length === 3) {
            const fechaCaducidad = new Date(parts[2], parts[1] - 1, parts[0]);
            if (fechaCaducidad < hoy) {
              const colContainer = card.closest('.col-12');
              if (colContainer) {
                colContainer.style.display = 'none';
              } else {
                card.style.display = 'none';
              }
              return;
            }
          }
        }

        const inputCodigo = card.querySelector('.coupon-code');
        if (inputCodigo && codigo) {
          inputCodigo.value = codigo;
        }

        const spanTexto = card.querySelector('.data-texto-display');
        if (spanTexto && textoCupon) {
          spanTexto.textContent = textoCupon;
        }

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

    document.addEventListener('click', (event) => {
      const target = event.target.closest('button');
      if (!target) return;
      const cardContainer = target.closest('.cupon');
      if (!cardContainer) return;

      if (target.dataset.action === 'copy-coupon') {
        event.preventDefault();
        handleCouponCodeCopy(target);
        return;
      }

      const message = buildCouponMessage(cardContainer);

      if (target.classList.contains('btn-whatsapp')) {
        event.preventDefault();
        handleWhatsAppShare(message);
      } else if (target.classList.contains('btn-share')) {
        event.preventDefault();
        handleNativeShareOrCopy(target, message);
      }
    });

    document.addEventListener('click', (event) => {
      const codigoGroup = event.target.closest('.input-group.codigo');
      if (!codigoGroup) return;
      const cardContainer = codigoGroup.closest('.cupon');
      if (!cardContainer) return;
      const copyButton = cardContainer.querySelector('[data-action="copy-coupon"]');
      if (copyButton) {
        handleCouponCodeCopy(copyButton);
      }
    });

    async function handleCouponCodeCopy(button) {
      const cardContainer = button.closest('.cupon');
      const couponElement = cardContainer.querySelector('.coupon-code');
      if (!couponElement) return;

      const couponText = (couponElement.value || couponElement.textContent || '').trim();
      if (!couponText) return;

      const textElement = button.querySelector('[data-original-text]');

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(couponText);
          showCopyFeedback(button, textElement, 'btn-light');
          return;
        } catch (err) {
          console.error('Fallo la API de Portapapeles. Intentando fallback execCommand.', err);
        }
      }

      if (fallbackCopyTextToClipboard(couponText)) {
        showCopyFeedback(button, textElement, 'btn-light');
      } else {
        console.error('Fallo el método de copia de fallback.');
        alert('¡Ouch! Tu navegador no permite la copia automática. Por favor, copia el texto manualmente: ' + couponText);
      }
    }

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

    async function handleNativeShareOrCopy(button, message) {
      const textElement = button.querySelector('.btn-text');

      if (navigator.share) {
        try {
          await navigator.share({ text: message, title: '¡Mira este Cupón Cyber!' });
          return;
        } catch (error) {
          console.warn('Fallo la API Nativa. Intentando copia al portapapeles.', error);
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(message);
          showCopyFeedback(button, textElement, 'btn-secondary');
          return;
        } catch (err) {
          console.warn('Fallo la copia con navigator.clipboard. Intentando execCommand.', err);
        }
      }

      if (fallbackCopyTextToClipboard(message)) {
        showCopyFeedback(button, textElement, 'btn-secondary');
      } else {
        console.error('Fallo todos los métodos de copia.');
        alert('¡Ups! No fue posible copiar el mensaje. Inténtalo manualmente.');
      }
    }

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
