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
  rutaImagen: ['rutaimagen', 'imagen', 'image', 'urlimagen', 'pathimagen'],
  imagen: ['imagenproducto', 'archivoimagen', 'imagefile', 'nombreimagen'],
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
  const texto = entrada.replace(/^\uFEFF/, '').trim()
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
      } else {
        entreComillas = !entreComillas
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
        const indiceCampo = tieneEncabezado ? indicesPorCampo.get(campo) ?? indice : indice
        destacado[campo] = fila[indiceCampo] ?? ''
      })

      return destacado
    })
    .filter((destacado) => destacado.categoria || destacado.rutaImagen || destacado.titulo || destacado.link)
    .filter((destacado) => !estaInactivo(destacado.status))
}
