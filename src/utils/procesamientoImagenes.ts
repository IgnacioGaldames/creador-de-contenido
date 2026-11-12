export type FormatoImagen = 'webp' | 'jpeg' | 'png'

export type OpcionesProcesamiento = {
  ancho?: number
  mantenerTamano?: boolean
  formato: FormatoImagen
  calidad: number
}

export type ResultadoImagen = {
  blob: Blob
  nombre: string
  ancho: number
  alto: number
  originalConservado?: boolean
  calidadAplicada?: number
}

function cargarImagen(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const imagen = new Image()
    imagen.onload = () => {
      URL.revokeObjectURL(url)
      resolve(imagen)
    }
    imagen.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('El formato no pudo ser leído por el navegador.'))
    }
    imagen.src = url
  })
}

function extensionDe(formato: FormatoImagen) {
  return formato === 'jpeg' ? 'jpg' : formato
}

export function nombreConFormato(nombre: string, formato: FormatoImagen) {
  return `${nombre.replace(/\.[^/.]+$/, '')}.${extensionDe(formato)}`
}

export async function procesarImagen(
  archivo: File,
  opciones: OpcionesProcesamiento,
): Promise<ResultadoImagen> {
  const imagen = await cargarImagen(archivo)
  const mantenerTamano = Boolean(opciones.mantenerTamano)
  const anchoSolicitado = Math.max(1, Math.round(opciones.ancho ?? imagen.naturalWidth))
  const ancho = mantenerTamano
    ? imagen.naturalWidth
    : Math.min(imagen.naturalWidth, anchoSolicitado)
  const alto = mantenerTamano
    ? imagen.naturalHeight
    : Math.max(1, Math.round((imagen.naturalHeight / imagen.naturalWidth) * ancho))
  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = alto
  const contexto = canvas.getContext('2d')

  if (!contexto) throw new Error('No se pudo preparar el lienzo de procesamiento.')
  contexto.imageSmoothingEnabled = true
  contexto.imageSmoothingQuality = 'high'
  if (opciones.formato === 'jpeg') {
    contexto.fillStyle = '#ffffff'
    contexto.fillRect(0, 0, ancho, alto)
  }
  contexto.drawImage(imagen, 0, 0, ancho, alto)

  const mime = opciones.formato === 'jpeg' ? 'image/jpeg' : `image/${opciones.formato}`
  let blob: Blob
  let calidadAplicada: number | undefined

  if (opciones.formato === 'webp') {
    const datos = contexto.getImageData(0, 0, ancho, alto)
    const { encode } = await import('@jsquash/webp')
    const calidadSolicitada = Math.round(opciones.calidad * 100)
    let mejorCandidato: Blob | null = null
    let blobReducido: Blob | null = null
    let calidadReducida: number | undefined

    // Busca la calidad más alta que deje la salida WebP por debajo del peso de entrada.
    for (let calidadCandidata = calidadSolicitada; calidadCandidata >= 20; calidadCandidata -= 5) {
      const resultado = await encode(datos, {
        quality: calidadCandidata,
        method: 6,
        autofilter: 1,
        use_sharp_yuv: 1,
      })
      const candidato = new Blob([resultado], { type: mime })
      mejorCandidato ??= candidato
      if (candidato.size < archivo.size) {
        blobReducido = candidato
        calidadReducida = calidadCandidata
        break
      }
    }

    const mismasDimensiones = ancho === imagen.naturalWidth && alto === imagen.naturalHeight
    const mismaCodificacion = archivo.type.toLowerCase() === mime
    if (blobReducido) {
      blob = blobReducido
      calidadAplicada = calidadReducida
    } else if (mismasDimensiones && mismaCodificacion) {
      blob = archivo
    } else if (mejorCandidato) {
      blob = mejorCandidato
    } else {
      throw new Error('El codificador WebP no pudo procesar la imagen.')
    }
  } else {
    const codificarCanvas = (calidad?: number) => new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((resultado) => {
        if (resultado) resolve(resultado)
        else reject(new Error('El navegador no pudo convertir la imagen.'))
      }, mime, calidad)
    })

    const mismasDimensiones = ancho === imagen.naturalWidth && alto === imagen.naturalHeight
    const mismaCodificacion = archivo.type.toLowerCase() === mime

    if (opciones.formato === 'jpeg') {
      let mejorCandidato: Blob | null = null
      let blobReducido: Blob | null = null
      for (let calidadCandidata = Math.round(opciones.calidad * 100); calidadCandidata >= 20; calidadCandidata -= 5) {
        const candidato = await codificarCanvas(calidadCandidata / 100)
        mejorCandidato ??= candidato
        if (candidato.size < archivo.size) {
          blobReducido = candidato
          calidadAplicada = calidadCandidata
          break
        }
      }

      blob = blobReducido ?? (mismasDimensiones && mismaCodificacion
        ? archivo
        : mejorCandidato ?? await codificarCanvas(opciones.calidad))
    } else {
      blob = await codificarCanvas()
      if (mismasDimensiones && mismaCodificacion && blob.size >= archivo.size) {
        blob = archivo
      }
    }
  }

  return {
    blob,
    nombre: blob === archivo ? archivo.name : nombreConFormato(archivo.name, opciones.formato),
    ancho,
    alto,
    originalConservado: blob === archivo,
    calidadAplicada,
  }
}
