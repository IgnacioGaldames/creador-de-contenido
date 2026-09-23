import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import JSZip from 'jszip'
import { procesarImagen, type FormatoImagen, type ResultadoImagen } from '../../utils/procesamientoImagenes'
import './estilosProcesadorImagenes.css'

type ImagenProcesada = ResultadoImagen & {
  id: string
  url: string
  tamanoOriginal: number
}

function formatearTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function descargar(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  enlace.click()
  URL.revokeObjectURL(url)
}

function ProcesadorImagenes() {
  const [imagenes, setImagenes] = useState<ImagenProcesada[]>([])
  const [ancho, setAncho] = useState(700)
  const [formato, setFormato] = useState<FormatoImagen>('webp')
  const [calidad, setCalidad] = useState(0.8)
  const [procesando, setProcesando] = useState(false)
  const [arrastrando, setArrastrando] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    imagenes.forEach((imagen) => URL.revokeObjectURL(imagen.url))
  }, [imagenes])

  const procesarArchivos = async (archivos: File[]) => {
    const archivosImagen = archivos.filter((archivo) => archivo.type.startsWith('image/'))
    if (!archivosImagen.length) {
      setError('Selecciona al menos un archivo de imagen compatible.')
      return
    }
    setError('')
    setProcesando(true)
    const resultados: ImagenProcesada[] = []
    for (const archivo of archivosImagen) {
      try {
        const resultado = await procesarImagen(archivo, { ancho, formato, calidad })
        resultados.push({
          ...resultado,
          id: `${archivo.name}-${archivo.lastModified}-${resultados.length}`,
          url: URL.createObjectURL(resultado.blob),
          tamanoOriginal: archivo.size,
        })
      } catch {
        setError(`No se pudo procesar "${archivo.name}". Verifica que no esté dañado.`)
      }
    }
    setImagenes((anteriores) => {
      anteriores.forEach((imagen) => URL.revokeObjectURL(imagen.url))
      return resultados
    })
    setProcesando(false)
  }

  const seleccionarArchivos = (event: ChangeEvent<HTMLInputElement>) => {
    void procesarArchivos(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const soltarArchivos = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setArrastrando(false)
    void procesarArchivos(Array.from(event.dataTransfer.files))
  }

  const descargarZip = async () => {
    const zip = new JSZip()
    imagenes.forEach((imagen) => zip.file(imagen.nombre, imagen.blob))
    descargar(await zip.generateAsync({ type: 'blob' }), `imagenes-${formato}.zip`)
  }

  return (
    <section className="procesador-imagenes">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div
            className={`zona-carga ${arrastrando ? 'zona-carga--activa' : ''}`}
            onDragEnter={(event) => { event.preventDefault(); setArrastrando(true) }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setArrastrando(false)}
            onDrop={soltarArchivos}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click() }}
          >
            <span className="fs-1">🖼️</span>
            <h2 className="h4 mt-2">Arrastra tus imágenes aquí</h2>
            <p className="text-muted mb-3">o selecciónalas desde tu computador</p>
            <span className="btn btn-primary">Seleccionar imágenes</span>
            <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={seleccionarArchivos} />
          </div>

          <div className="row g-3 mt-2">
            <div className="col-sm-4">
              <label className="form-label fw-semibold" htmlFor="ancho-imagen">Ancho (px)</label>
              <input id="ancho-imagen" className="form-control" type="number" min="1" value={ancho} onChange={(event) => setAncho(Number(event.target.value))} />
            </div>
            <div className="col-sm-4">
              <label className="form-label fw-semibold" htmlFor="formato-imagen">Formato</label>
              <select id="formato-imagen" className="form-select" value={formato} onChange={(event) => setFormato(event.target.value as FormatoImagen)}>
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <div className="col-sm-4">
              <label className="form-label fw-semibold" htmlFor="calidad-imagen">Calidad: {formato === 'png' ? 'sin pérdida' : `${Math.round(calidad * 100)}%`}</label>
              <input id="calidad-imagen" className="form-range mt-2" type="range" min="0.2" max="1" step="0.05" value={calidad} disabled={formato === 'png'} onChange={(event) => setCalidad(Number(event.target.value))} />
            </div>
          </div>
          <p className="small text-muted mb-0 mt-2">Las imágenes se procesan localmente y conservan su proporción.</p>

          {error && <div className="alert alert-warning mt-4 mb-0">{error}</div>}
          {procesando && <div className="alert alert-info mt-4 mb-0">Procesando imágenes...</div>}

          {!!imagenes.length && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                <h2 className="h5 mb-0">{imagenes.length} imagen{imagenes.length === 1 ? '' : 'es'} procesada{imagenes.length === 1 ? '' : 's'}</h2>
                <button className="btn btn-success" type="button" onClick={() => void descargarZip()}>Descargar todo (.zip)</button>
              </div>
              <div className="row g-3">
                {imagenes.map((imagen) => {
                  const reduccion = Math.max(0, Math.round((1 - imagen.blob.size / imagen.tamanoOriginal) * 100))
                  return (
                    <div className="col-sm-6 col-lg-4" key={imagen.id}>
                      <div className="card h-100">
                        <img className="vista-previa" src={imagen.url} alt={imagen.nombre} />
                        <div className="card-body">
                          <p className="small fw-semibold text-truncate mb-2" title={imagen.nombre}>{imagen.nombre}</p>
                          <p className="small text-muted mb-2">{imagen.ancho} × {imagen.alto} px</p>
                          <p className="small mb-3">{formatearTamano(imagen.tamanoOriginal)} → {formatearTamano(imagen.blob.size)} <span className="text-success">(-{reduccion}%)</span></p>
                          <button className="btn btn-outline-primary btn-sm w-100" type="button" onClick={() => descargar(imagen.blob, imagen.nombre)}>Descargar imagen</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProcesadorImagenes
