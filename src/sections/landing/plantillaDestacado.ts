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

const textoConSaltos = (valor: string): string =>
  valor
    .split(/(<br\s*\/?>|\r?\n)/i)
    .map((parte) =>
      /^<br\s*\/?>$/i.test(parte) || /^\r?\n$/.test(parte) ? '<br>' : escaparHtml(parte)
    )
    .join('')

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
  const valorLimpio = valor.trim()
  const textoPrecio = /^desde\s/i.test(valorLimpio)
    ? valorLimpio
    : `$${valorLimpio.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  const cruzado = clase === 'pcln'
  const claseContenedor = cruzado
    ? 'precio pcln d-none d-md-flex my-3px ms-1 p-0 pl-1 d-flex mw-fit align-items-center bg-none text-black articulat-light'
    : `precio ${clase} my-3px px-5px py-2px d-flex mw-fit align-items-center ${clase === 'pclth' ? 'bg-white text-naranjo' : 'bg-white text-black'} articulat-bold`
  const claseTexto = cruzado
    ? 'mb-0 d-flex align-items-center text-decoration-line-through fs-11px fs-md-13px'
    : `mb-0 d-flex align-items-center fs-11px fs-md-15px ${textoClase}`

  return `\n              <div class="${claseContenedor}">\n                <p class="${claseTexto}">${textoConSaltos(textoPrecio)}</p>\n              </div>`
}

const crearDescuentos = (llamado: string): string => {
  const descuentos = llamado
    .split(/<br\s*\/?>|\r?\n/i)
    .map((linea) => {
      const coincidencia = linea.match(/(\d+(?:[.,]\d+)?)\s*%/)
      if (!coincidencia) return ''

      const porcentaje = coincidencia[1].replace(',', '.')
      const etiqueta = /\bTH\b/i.test(linea)
        ? /cup[oó]n/i.test(llamado) ? 'Cupón con Tarjeta Hites' : 'Con Tarjeta Hites'
        : /\bTMP\b/i.test(linea)
          ? 'Todo medio de pago'
          : 'Adicional ya aplicado'

      return `
              <div class="porcentajeDcto w-fc lh-sm p-3px text-white bg-red rounded-2 p-5px">
                <div class="d-flex flex-row align-items-center justify-content-center">
                  <div class="lh-1 d-flex flex-row align-items-center">
                    <span class="fs-29px fs-md-56px articulat-heavy lh-75"><b>${escaparHtml(porcentaje)}</b></span>
                  </div>
                  <div class="dcto lh-1 d-flex flex-column align-items-center">
                    <div class="fs-11px fs-md-18px articulat-heavy"><b>%</b></div>
                    <div class="fs-5px fs-md-8px articulat-heavy">dcto</div>
                  </div>
                </div>
                <p class="m-0 text-center lh-05 pt-3px fs-6px fs-md-8px articulat-heavy">${etiqueta}</p>
              </div>`
    })
    .filter(Boolean)

  if (!descuentos.length) return ''
  return `
            <div class="porcentaje position-absolute d-flex flex-column m-auto right-3 articulat top-5">
              ${descuentos.map((descuento, indice) =>
                indice === 0 ? descuento : descuento.replace('p-5px">', 'p-5px mt-1">')
              ).join('\n')}
            </div>`
}

export const obtenerPlantillaDestacado = (
  destacado: DestacadoLanding,
  rutaBase: string
): string => {
  const rutaImagen = agregarStaticlink(obtenerImagen(destacado, rutaBase))
  const tituloImagen = destacado.titulo || destacado.nombreProducto || destacado.categoria
  const titulo = destacado.titulo || destacado.nombreProducto
  const imagenEsPlaceholder = /\/\.webp(?:\?[^?]*)?$/i.test(rutaImagen)
  const srcImagen = imagenEsPlaceholder
    ? `https://placehold.co/500x500/E2E2E2/333333?text=${encodeURIComponent(tituloImagen.replace(/<br\s*\/?>/gi, ' '))}`
    : rutaImagen
  const imagenHtml = rutaImagen
    ? `
            <picture>
              <source type="image/webp" data-size="mobile" media="(max-width: 767.98px)" srcset="${escaparHtml(srcImagen)}">
              <source type="image/webp" data-size="desktop" media="(min-width: 768px)" srcset="${escaparHtml(srcImagen)}">
              <img loading="lazy" decoding="async" src="${escaparHtml(srcImagen)}"
                class="img-fluid w-100" alt="${escaparHtml(tituloImagen)}" title="${escaparHtml(tituloImagen)}"
                data-department="${escaparHtml(destacado.categoria)}" data-position="${escaparHtml(destacado.posicion)}"
                data-size="3" data-zone="upper">
            </picture>`
    : ''

  const tituloHtml = titulo
    ? `
            <div class="titulo position-absolute d-flex flex-row m-auto left-3 articulat top-5">
              <p class="w-fc my-2px p-3px articulat-bold text-uppercase- fs-15px fs-md-23px bg-black- text-white lh-0-9">${textoConSaltos(titulo)}</p>
            </div>`
    : ''
  const descuentoHtml = crearDescuentos(destacado.llamado)
  const detalles = [
    destacado.marca
      ? `<p class="marca w-fc my-2px px-12px py-3px articulat-bold text-uppercase fs-10px fs-md-14px bg-black text-white">${textoConSaltos(destacado.marca)}</p>`
      : ''
  ].filter(Boolean).join('\n                ')
  const esPrecioDesde = /^desde\s+\$/i.test(destacado.llamado.trim())
  const mostrarPrecioUnicoComoOferta =
    !destacado.precioOferta && !destacado.precioTh && Boolean(destacado.precioNormal)
  const precioOferta = destacado.precioOferta ||
    (esPrecioDesde ? destacado.llamado.trim() : mostrarPrecioUnicoComoOferta ? destacado.precioNormal : '')
  const precioNormal = mostrarPrecioUnicoComoOferta ? '' : destacado.precioNormal
  const precios = [
    crearPrecio(destacado.precioTh, 'pclth', ''),
    crearPrecio(precioOferta, 'pclod', 'precio-oferta-black'),
    crearPrecio(precioNormal, 'pcln', '')
  ].filter(Boolean).join('')
  const informacionHtml = `
            <div class="preciosChicosLargos w-60 w-md-50 articulat position-absolute left-0 bottom-0 lh-1 px-13px py-5px">${detalles ? `\n              <div class="textDestacado align-items-center">\n                ${detalles}\n              </div>` : ''}${precios}
            </div>`
  const contenido = `${tituloHtml}${descuentoHtml}${imagenHtml}${informacionHtml}`
  const claseTarjeta = 'bottom-img-h d-flex flex-column align-items-stretch overflow-hidden text-decoration-none rounded-3 h-100 img-gradient- bg-cyber-gris'
  const interior = `<a href="${escaparHtml(destacado.link || '#')}" class="${claseTarjeta}">${contenido}</a>`

  return `      <div class="col-6 col-md-3 px-1 px-md-1 mb-2">
        <div class="dest-doble- d-flex flex-column align-items-stretch h-100 position-relative">
          ${interior}
        </div>
      </div>`
}
