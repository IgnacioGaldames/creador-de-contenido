export interface DestacadoLanding {
  categoria: string
  status: string
  posicion: string
  rutaImagen: string
  imagen: string
  titulo: string
  llamado: string
  sku1: string
  sku2: string
  nombreProducto: string
  marca: string
  precioNormal: string
  precioOferta: string
  precioTh: string
  dctoOferta: string
  dctoThRibbon: string
  link: string
}

type CampoLanding = keyof DestacadoLanding

const CAMPOS_POR_POSICION: CampoLanding[] = [
  'categoria',
  'status',
  'posicion',
  'rutaImagen',
  'titulo',
  'llamado',
  'sku1',
  'sku2',
  'imagen',
  'nombreProducto',
  'marca',
  'precioNormal',
  'precioOferta',
  'precioTh',
  'dctoOferta',
  'dctoThRibbon',
  'link'
]

const ALIAS_CAMPOS: Record<CampoLanding, string[]> = {
  categoria: ['categoria', 'department', 'departamento'],
  status: ['status', 'estado'],
  posicion: ['posicion', 'position'],
  rutaImagen: ['rutaimagen', 'carpetaimagen', 'imagepath', 'pathimagen'],
  imagen: ['imagen', 'archivoimagen', 'imagefile', 'nombreimagen'],
  titulo: ['titulo', 'title'],
  llamado: ['llamado', 'callout', 'bajada'],
  sku1: ['sku1'],
  sku2: ['sku2'],
  nombreProducto: ['nombreproducto', 'producto', 'descripcion'],
  marca: ['marca', 'brand'],
  precioNormal: ['precionormal', 'preciolista', 'preciooriginal'],
  precioOferta: ['preciooferta', 'precioofertanormal'],
  precioTh: ['precioth', 'preciohites', 'precioespecial'],
  dctoOferta: ['dctooferta', 'descuentooferta', 'descuento'],
  dctoThRibbon: ['dctothribbon', 'descuentothribbon', 'ribbon'],
  link: ['link', 'url', 'enlace', 'href']
}

const normalizarNombre = (valor: string): string =>
  valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const contarSeparadores = (linea: string, separador: string): number => {
  let cantidad = 0
  let entreComillas = false

  for (let indice = 0; indice < linea.length; indice += 1) {
    const caracter = linea[indice]
    if (caracter === '"') {
      if (entreComillas && linea[indice + 1] === '"') {
        indice += 1
      } else {
        entreComillas = !entreComillas
      }
    } else if (caracter === separador && !entreComillas) {
      cantidad += 1
    }
  }

  return cantidad
}

const prepararEntrada = (entrada: string): string => {
  const lineas = entrada.replace(/^\uFEFF/, '').split(/\r?\n/)
  const lineasLimpias = lineas
    .map((linea) => linea.trim())
    .filter((linea) => linea && linea !== '"')
    .filter((linea) => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(linea))
    .map((linea) => {
      let contenido = linea
      if (contenido.startsWith('|')) contenido = contenido.slice(1)
      if (contenido.endsWith('|')) contenido = contenido.slice(0, -1)
      return contenido
        .trim()
        .replace(/,\\\|\s*$/, '')
        .replace(/\\\|/g, '%7C')
        .replace(/\\_/g, '_')
    })

  return lineasLimpias.join('\n').replace(/^["']|["']$/g, '').trim()
}

const detectarSeparador = (texto: string): string => {
  const primeraLinea = texto.split(/\r?\n/, 1)[0] ?? ''
  const opciones = [',', '\t', ';']

  return opciones.reduce((mejor, actual) =>
    contarSeparadores(primeraLinea, actual) > contarSeparadores(primeraLinea, mejor)
      ? actual
      : mejor
  )
}

const analizarFilas = (entrada: string): string[][] => {
  const texto = prepararEntrada(entrada)
  if (!texto) return []

  const separador = detectarSeparador(texto)
  const filas: string[][] = []
  let fila: string[] = []
  let campo = ''
  let entreComillas = false

  const cerrarCampo = () => {
    fila.push(campo.trim())
    campo = ''
  }

  const cerrarFila = () => {
    cerrarCampo()
    while (fila.at(-1) === '') fila.pop()
    if (fila.some((valor) => valor !== '')) filas.push(fila)
    fila = []
  }

  for (let indice = 0; indice < texto.length; indice += 1) {
    const caracter = texto[indice]

    if (caracter === '"') {
      if (entreComillas && texto[indice + 1] === '"') {
        campo += '"'
        indice += 1
      } else if (entreComillas) {
        entreComillas = !entreComillas
      } else if (campo.trim() === '') {
        entreComillas = true
      } else {
        campo += caracter
      }
      continue
    }

    if (!entreComillas && caracter === separador) {
      cerrarCampo()
      continue
    }

    if (!entreComillas && (caracter === '\n' || caracter === '\r' || caracter === '|')) {
      if (caracter === '\r' && texto[indice + 1] === '\n') indice += 1
      cerrarFila()
      continue
    }

    campo += caracter
  }

  if (campo !== '' || fila.length > 0) cerrarFila()
  return filas
}

const pareceEncabezado = (fila: string[]): boolean => {
  const nombres = new Set(fila.map(normalizarNombre))
  const encabezadosClave = ['categoria', 'status', 'posicion', 'rutaimagen', 'nombreproducto']
  return encabezadosClave.filter((nombre) => nombres.has(nombre)).length >= 2
}

const estaInactivo = (status: string): boolean =>
  ['inactivo', 'inactiva', 'desactivado', 'desactivada', 'deshabilitado', 'false', 'no', 'off', '0']
    .includes(normalizarNombre(status))

export const procesarCsvLanding = (entrada: string): DestacadoLanding[] => {
  const filas = analizarFilas(entrada)
  if (filas.length === 0) return []

  const tieneEncabezado = pareceEncabezado(filas[0])
  const indicesPorCampo = new Map<CampoLanding, number>()

  if (tieneEncabezado) {
    const encabezados = filas[0].map(normalizarNombre)
    for (const campo of CAMPOS_POR_POSICION) {
      const indice = encabezados.findIndex((encabezado) =>
        ALIAS_CAMPOS[campo].includes(encabezado)
      )
      if (indice >= 0) indicesPorCampo.set(campo, indice)
    }
  }

  const filasDatos = tieneEncabezado ? filas.slice(1) : filas

  return filasDatos
    .map((fila) => {
      const destacado = {} as DestacadoLanding

      CAMPOS_POR_POSICION.forEach((campo, indice) => {
        if (campo === 'link') return
        const indiceCampo = tieneEncabezado ? indicesPorCampo.get(campo) ?? indice : indice
        destacado[campo] = fila[indiceCampo] ?? ''
      })

      let indiceLink = -1
      for (let indice = fila.length - 1; indice >= 0; indice -= 1) {
        if (/^(?:https?:\/\/|\/)/i.test(fila[indice].trim())) {
          indiceLink = indice
          break
        }
      }
      const linkPorPosicion = tieneEncabezado
        ? indicesPorCampo.get('link')
        : CAMPOS_POR_POSICION.indexOf('link')
      destacado.link = indiceLink >= 0
        ? fila[indiceLink]
        : fila[linkPorPosicion ?? -1] ?? ''
      return destacado
    })
    .filter((destacado) =>
      Boolean(
        destacado.titulo ||
        destacado.llamado ||
        destacado.sku1 ||
        destacado.sku2 ||
        destacado.nombreProducto ||
        destacado.marca ||
        destacado.precioNormal ||
        destacado.precioOferta ||
        destacado.precioTh ||
        destacado.link ||
        (destacado.imagen && !/\/\.webp$/i.test(destacado.imagen))
      )
    )
    .filter((destacado) => !estaInactivo(destacado.status))
    .map((destacado, indice) => ({
      ...destacado,
      posicion: destacado.posicion || String(indice + 1)
    }))
}
