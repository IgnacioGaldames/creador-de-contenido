import cssCrudo from './estilosLanding.css?raw'
import { obtenerPlantillaDestacado } from './plantillaDestacado'
import type { DestacadoLanding } from './procesarCsvLanding'

const escaparAtributo = (valor: string): string =>
  valor.replace(/[&<>"']/g, (caracter) => {
    const entidades: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return entidades[caracter] ?? caracter
  })

const resolverRuta = (rutaBase: string, rutaArchivo: string): string => {
  const archivo = rutaArchivo.trim()
  if (!archivo) return ''
  if (/^(?:https?:)?\/\//i.test(archivo) || archivo.startsWith('/') || /^images\//i.test(archivo)) {
    return archivo
  }
  const prefijo = rutaBase.replace(/\/+$/, '')
  return prefijo ? `${prefijo}/${archivo.replace(/^\/+/, '')}` : archivo.replace(/^\/+/, '')
}

const agregarStaticlink = (ruta: string): string =>
  ruta &&
  !ruta.includes('$staticlink$') &&
  !/^(?:https?:)?\/\//i.test(ruta) &&
  !ruta.startsWith('/')
    ? `${ruta}?$staticlink$`
    : ruta

export const obtenerPlantillaLanding = (
  destacados: DestacadoLanding[],
  colorFondo: string,
  rutaBase: string,
  imagenDesktop: string,
  imagenMobile: string
): string => {
  const bloquesDestacados = destacados
    .map((destacado) => obtenerPlantillaDestacado(destacado, rutaBase))
    .join('\n')
  const rutaDesktop = agregarStaticlink(resolverRuta(rutaBase, imagenDesktop))
  const rutaMobile = agregarStaticlink(resolverRuta(rutaBase, imagenMobile || imagenDesktop))
  const cabecera = rutaDesktop || rutaMobile
    ? `
    <div class="row px-2">
      <div class="col-12 my-3">
        <a href="/?icn=home&amp;ici=logo-horizontal" class="linkDestacado">
          <picture>
            ${rutaMobile ? `<source data-size="mobile" media="(max-width: 767.98px)" srcset="${escaparAtributo(rutaMobile)}">` : ''}
            ${rutaDesktop ? `<source data-size="desktop" media="(min-width: 768px)" srcset="${escaparAtributo(rutaDesktop)}">` : ''}
            <img loading="lazy" decoding="async" src="${escaparAtributo(rutaDesktop || rutaMobile)}"
              class="img-fluid w-100 rounded-3" alt="Imagen de cabecera" title="Imagen de cabecera"
              data-department="Landing" data-position="1" data-size="6" data-zone="superior"
              data-test="landing-cabecera">
          </picture>
        </a>
      </div>
    </div>` : ''

  return `<style>
${cssCrudo}
</style>
<section class="container-fluid landing-generada" style="background-color: ${escaparAtributo(colorFondo)};">
  <div class="container">
${cabecera}
    <div class="row" id="misDestacados">
${bloquesDestacados}
    </div>
  </div>
</section>`
}
