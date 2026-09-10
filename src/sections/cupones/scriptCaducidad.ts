// src/sections/cupones/scriptCaducidad.ts

/**
 * Script de Vanilla JS para Storefront.
 * Oculta automáticamente los cupones cuya fecha de caducidad ha sido superada.
 */
export const scriptCaducidad = `
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const cupones = document.querySelectorAll('.cupon');

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    cupones.forEach(function (cupon) {
      const fechaTexto = cupon.getAttribute('data-caducidad');

      if (fechaTexto) {
        const partes = fechaTexto.split('-');
        const fechaCaducidad = new Date(partes[2], partes[1] - 1, partes[0]);

        if (hoy > fechaCaducidad) {
          // Busca el contenedor padre ya sea en modo carrusel o grilla
          const contenedor = cupon.closest('.slide-mundo') || cupon.closest('.col-12');
          if (contenedor) {
            // contenedor.style.display = 'none';
            contenedor.remove();
          }
        }
      }
    });
  });
  
</script>

`;