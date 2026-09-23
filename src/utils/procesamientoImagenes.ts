export type FormatoImagen = 'webp' | 'jpeg' | 'png'

export type OpcionesProcesamiento = {
  ancho: number
  formato: FormatoImagen
  calidad: number
}

export type ResultadoImagen = {
  blob: Blob
  nombre: string
  ancho: number
  alto: number
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
  const ancho = Math.max(1, Math.round(opciones.ancho))
  const alto = Math.max(1, Math.round((imagen.naturalHeight / imagen.naturalWidth) * ancho))
  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = alto
  const contexto = canvas.getContext('2d')

  if (!contexto) throw new Error('No se pudo preparar el lienzo de procesamiento.')
  if (opciones.formato === 'jpeg') {
    contexto.fillStyle = '#ffffff'
    contexto.fillRect(0, 0, ancho, alto)
  }
  contexto.drawImage(imagen, 0, 0, ancho, alto)

  const mime = `image/${opciones.formato}`
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((resultado) => {
      if (resultado) resolve(resultado)
      else reject(new Error('El navegador no pudo convertir la imagen.'))
    }, mime, opciones.formato === 'png' ? undefined : opciones.calidad)
  })

  return {
    blob,
    nombre: nombreConFormato(archivo.name, opciones.formato),
    ancho,
    alto,
  }
}
