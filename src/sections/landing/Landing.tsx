import { useCallback, useEffect, useMemo, useState } from 'react'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'
import { obtenerPlantillaLanding } from './plantillaLanding'
import { procesarCsvLanding } from './procesarCsvLanding'
import './estilosLanding.css'

const CLAVE_RUTA_BASE = 'landing-ruta-base-imagenes'
const RUTA_BASE_PREDETERMINADA = 'images/Landing/2026/locura/'

export default function Landing() {
  const [datosCsv, setDatosCsv] = useState('')
  const [rutaBase, setRutaBase] = useState(
    () => localStorage.getItem(CLAVE_RUTA_BASE) ?? RUTA_BASE_PREDETERMINADA
  )
  const [colorFondo, setColorFondo] = useState('#2323fe')
  const [imagenDesktop, setImagenDesktop] = useState('')
  const [imagenMobile, setImagenMobile] = useState('')
  const [errorArchivo, setErrorArchivo] = useState('')
  const { ejecutarCopia, copiado, generado, errorCopia } = useProcesarYCopiar()

  useEffect(() => {
    localStorage.setItem(CLAVE_RUTA_BASE, rutaBase)
  }, [rutaBase])

  const destacados = useMemo(() => procesarCsvLanding(datosCsv), [datosCsv])
  const htmlGenerado = useMemo(() => {
    if (!datosCsv.trim()) return ''
    return obtenerPlantillaLanding(
      destacados,
      colorFondo,
      rutaBase,
      imagenDesktop,
      imagenMobile
    )
  }, [colorFondo, datosCsv, destacados, imagenDesktop, imagenMobile, rutaBase])

  const manejarAccion = useCallback(() => {
    if (htmlGenerado) void ejecutarCopia(htmlGenerado)
  }, [ejecutarCopia, htmlGenerado])

  useEffect(() => {
    if (htmlGenerado) void ejecutarCopia(htmlGenerado)
  }, [ejecutarCopia, htmlGenerado])

  const cargarCsv = async (archivo: File | undefined) => {
    if (!archivo) return
    try {
      setDatosCsv(await archivo.text())
      setErrorArchivo('')
    } catch {
      setErrorArchivo('No se pudo leer el archivo CSV. Intenta pegar su contenido en el campo.')
    }
  }

  return (
    <div className="card p-4 shadow-sm mb-4 landing-editor">
      <h2 className="h4 card-title mb-2">Creador de landings</h2>
      <p className="text-muted mb-4">
        Pega las filas del Excel y copia el HTML completo. Los datos opcionales vacíos se omiten.
      </p>

      <div className="mb-4 bg-white p-3 border rounded">
        <label htmlFor="landing-ruta-base" className="form-label fw-bold">
          Ruta base de imágenes
        </label>
        <input
          id="landing-ruta-base"
          type="text"
          className="form-control font-monospace"
          value={rutaBase}
          onChange={(evento) => setRutaBase(evento.target.value)}
          placeholder="images/Landing/2026/locura/"
        />
        <div className="form-text">Se guarda en este navegador y se restaura al volver a abrir la sección.</div>
      </div>

      <div className="mb-4 bg-white p-3 border rounded">
        <h3 className="h6 fw-bold mb-3">Imágenes de cabecera</h3>
        <p className="small text-muted mb-3">
          Selecciona los archivos que subirás al CMS. El HTML usará sus nombres dentro de la ruta base.
        </p>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="landing-cabecera-desktop" className="form-label fw-semibold">Desktop</label>
            <input
              id="landing-cabecera-desktop"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(evento) => setImagenDesktop(evento.target.files?.[0]?.name ?? '')}
            />
            {imagenDesktop && (
              <input
                type="text"
                className="form-control form-control-sm font-monospace mt-2"
                aria-label="Nombre de imagen de cabecera desktop"
                value={imagenDesktop}
                onChange={(evento) => setImagenDesktop(evento.target.value)}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="landing-cabecera-mobile" className="form-label fw-semibold">Mobile</label>
            <input
              id="landing-cabecera-mobile"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(evento) => setImagenMobile(evento.target.files?.[0]?.name ?? '')}
            />
            {imagenMobile && (
              <input
                type="text"
                className="form-control form-control-sm font-monospace mt-2"
                aria-label="Nombre de imagen de cabecera mobile"
                value={imagenMobile}
                onChange={(evento) => setImagenMobile(evento.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 bg-white p-3 border rounded">
        <label htmlFor="landing-color-fondo" className="form-label fw-bold">
          Color de fondo
        </label>
        <div className="d-flex align-items-center gap-3">
          <input
            id="landing-color-fondo"
            type="color"
            className="form-control form-control-color"
            value={colorFondo}
            onChange={(evento) => setColorFondo(evento.target.value)}
            title="Elegir color de fondo"
          />
          <code>{colorFondo}</code>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <label htmlFor="landing-csv" className="form-label fw-bold mb-0">Datos de destacados (CSV)</label>
          <input
            type="file"
            className="form-control form-control-sm landing-editor__csv-file"
            accept=".csv,text/csv"
            aria-label="Cargar archivo CSV"
            onChange={(evento) => void cargarCsv(evento.target.files?.[0])}
          />
        </div>
        <p className="small text-muted">
          Columnas: CATEGORIA, STATUS, POSICION, RUTA IMAGEN, TITULO, LLAMADO, SKU_1, SKU_2,
          imagen, NOMBRE_PRODUCTO, MARCA, PRECIO_NORMAL, PRECIO_OFERTA, PRECIO_TH, DCTO_OFERTA,
          DCTO_THRIBBON, LINK. Admite filas separadas por | o saltos de línea.
        </p>
        <textarea
          id="landing-csv"
          className="form-control font-monospace"
          rows={7}
          placeholder="Pega aquí las filas del CSV..."
          value={datosCsv}
          onChange={(evento) => {
            setDatosCsv(evento.target.value)
            setErrorArchivo('')
          }}
        />
        {errorArchivo && <p className="text-danger small mt-2 mb-0" role="alert">{errorArchivo}</p>}
        {datosCsv.trim() && (
          <p className="small text-muted mt-2 mb-0">
            {destacados.length} destacado{destacados.length === 1 ? '' : 's'} activo{destacados.length === 1 ? '' : 's'} procesado{destacados.length === 1 ? '' : 's'}.
          </p>
        )}
      </div>

      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />
      {errorCopia && (
        <p className="text-danger small mt-2" role="alert">
          No se pudo copiar automáticamente. Revisa los permisos del portapapeles y usa el botón para reintentar.
        </p>
      )}

      {htmlGenerado && (
        <div className="mt-2">
          <h3 className="h5 card-title mb-2">HTML completo generado y copiado</h3>
          <textarea
            className="form-control font-monospace bg-dark text-warning"
            rows={14}
            value={htmlGenerado}
            readOnly
            aria-label="HTML completo de la landing"
          />
        </div>
      )}
    </div>
  )
}
