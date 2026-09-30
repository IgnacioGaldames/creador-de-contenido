import type { DestacadoLanding } from './procesarCsvLanding'

const escaparHtml = (valor: string): string =>
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

const textoConSaltos = (valor: string): string => escaparHtml(valor).replace(/\r?\n/g, '<br>')

const unirRuta = (base: string, archivo: string): string => {
  const ruta = archivo.trim()
  if (!ruta) return ''
  if (/^(?:https?:)?\/\//i.test(ruta) || ruta.startsWith('/')) return ruta
  if (/^images\//i.test(ruta)) return ruta
  const prefijo = base.replace(/\/+$/, '')
  return prefijo ? `${prefijo}/${ruta.replace(/^\/+/, '')}` : ruta.replace(/^\/+/, '')
}

const obtenerImagen = (destacado: DestacadoLanding, rutaBase: string): string => {
  const ruta = destacado.rutaImagen.trim()
  const imagen = destacado.imagen.trim()

  if (imagen && (ruta.endsWith('/') || (ruta && !/\.[a-z0-9]{2,6}(?:[?#].*)?$/i.test(ruta)))) {
    return unirRuta(ruta, imagen)
  }

  return unirRuta(rutaBase, ruta || imagen)
}

const agregarStaticlink = (ruta: string): string =>
  ruta &&
  !ruta.includes('$staticlink$') &&
  !/^(?:https?:)?\/\//i.test(ruta) &&
  !ruta.startsWith('/')
    ? `${ruta}?$staticlink$`
    : ruta

const crearPrecio = (valor: string, clase: string, textoClase: string): string => {
  if (!valor.trim()) return ''
  const cruzado = clase === 'pcln'
  const claseContenedor = cruzado
    ? 'precio pcln d-none d-md-flex my-3px ms-1 p-0 pl-1 d-flex mw-fit align-items-center bg-none articulat-light'
    : `precio ${clase} my-3px px-5px py-2px d-flex mw-fit align-items-center ${clase === 'pclth' ? 'bg-white text-naranjo' : 'bg-white text-black'} articulat-bold`
  const claseTexto = cruzado
    ? 'mb-0 d-flex align-items-center text-decoration-line-through fs-11px fs-md-13px'
    : `mb-0 d-flex align-items-center fs-11px fs-md-15px ${textoClase}`

  return `\n              <div class="${claseContenedor}">\n                <p class="${claseTexto}">${escaparHtml(valor)}</p>\n              </div>`
}

const crearDescuento = (valor: string, llamado: string, claseExtra = ''): string => {
  if (!valor.trim()) return ''
  return `
            <div class="porcentaje position-absolute d-flex flex-column m-auto right-3 articulat top-5 ${claseExtra}">
              <div class="porcentajeDcto w-fc lh-sm p-3px text-white bg-red rounded-2 p-5px">
                <div class="d-flex flex-row align-items-center justify-content-center">
                  <div class="lh-1 d-flex flex-row align-items-center">
                    <span class="fs-29px fs-md-56px articulat-heavy lh-75"><b>${escaparHtml(valor.replace(/%/g, '').trim())}</b></span>
                  </div>
                  <div class="dcto lh-1 d-flex flex-column align-items-center">
                    <div class="fs-11px fs-md-18px articulat-heavy"><b>%</b></div>
                    <div class="fs-5px fs-md-8px articulat-heavy">dcto</div>
                  </div>
                </div>${llamado ? `\n                <p class="m-0 text-center lh-05 pt-3px fs-6px fs-md-8px articulat-heavy">${textoConSaltos(llamado)}</p>` : ''}
              </div>
            </div>`
}

export const obtenerPlantillaDestacado = (
  destacado: DestacadoLanding,
  rutaBase: string
): string => {
  const rutaImagen = agregarStaticlink(obtenerImagen(destacado, rutaBase))
  const tituloImagen = destacado.titulo || destacado.nombreProducto || destacado.categoria
  const atributosSku = [
    destacado.sku1 ? ` data-sku-1="${escaparHtml(destacado.sku1)}"` : '',
    destacado.sku2 ? ` data-sku-2="${escaparHtml(destacado.sku2)}"` : ''
  ].join('')
  const imagenHtml = rutaImagen
    ? `
            <picture>
              <source data-size="mobile" media="(max-width: 767.98px)" srcset="${escaparHtml(rutaImagen)}">
              <source data-size="desktop" media="(min-width: 768px)" srcset="${escaparHtml(rutaImagen)}">
              <img loading="lazy" decoding="async" src="${escaparHtml(rutaImagen)}"
                class="img-fluid w-100" alt="${escaparHtml(tituloImagen)}" title="${escaparHtml(tituloImagen)}"
                data-department="${escaparHtml(destacado.categoria)}" data-position="${escaparHtml(destacado.posicion)}"
                data-size="3" data-zone="upper"${atributosSku}>
            </picture>`
    : ''

  const tituloHtml = destacado.titulo
    ? `
            <div class="titulo position-absolute d-flex flex-row m-auto left-3 articulat top-5">
              <p class="w-fc my-2px p-3px articulat-bold text-uppercase- fs-15px fs-md-23px bg-black- text-white lh-0-9">${textoConSaltos(destacado.titulo)}</p>
            </div>`
    : ''
  const descuentoHtml = crearDescuento(destacado.dctoOferta, destacado.llamado)
  const ribbonHtml = crearDescuento(destacado.dctoThRibbon, '', 'mt-1')
  const llamadoHtml = !destacado.dctoOferta && destacado.llamado
    ? `<div class="llamado position-absolute right-3 top-5"><span class="badge bg-red text-white">${textoConSaltos(destacado.llamado)}</span></div>`
    : ''
  const detalles = [
    destacado.marca
      ? `<p class="marca w-fc my-2px px-12px py-3px articulat-bold text-uppercase fs-10px fs-md-14px bg-black text-white">${textoConSaltos(destacado.marca)}</p>`
      : '',
    destacado.nombreProducto
      ? `<p class="descripcion articulat-bold my-2px text-white fs-8px fs-md-14px">${textoConSaltos(destacado.nombreProducto)}</p>`
      : ''
  ].filter(Boolean).join('\n                ')
  const precios = [
    crearPrecio(destacado.precioTh, 'pclth', ''),
    crearPrecio(destacado.precioOferta, 'pclod', 'precio-oferta-black'),
    crearPrecio(destacado.precioNormal, 'pcln', '')
  ].filter(Boolean).join('')
  const informacionHtml = detalles || precios
    ? `
            <div class="preciosChicosLargos w-60 w-md-50 articulat position-absolute left-0 bottom-0 lh-1 px-13px py-5px">${detalles ? `\n              <div class="textDestacado align-items-center">\n                ${detalles}\n              </div>` : ''}${precios}
            </div>`
    : ''
  const contenido = `${tituloHtml}${descuentoHtml}${ribbonHtml}${llamadoHtml}${imagenHtml}${informacionHtml}`
  const claseTarjeta = 'bottom-img-h d-flex flex-column align-items-stretch overflow-hidden text-decoration-none rounded-3 h-100 img-gradient- bg-cyber-gris'
  const interior = destacado.link
    ? `<a href="${escaparHtml(destacado.link)}" class="${claseTarjeta}">${contenido}</a>`
    : `<div class="${claseTarjeta}">${contenido}</div>`

  return `      <div class="col-6 col-md-3 px-1 px-md-1 mb-2 mb-md-0">
        <div class="dest-doble- d-flex flex-column align-items-stretch h-100 position-relative">
          ${interior}
        </div>
      </div>`
}
