// src/sections/inpage/Inpage.tsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { generarBloqueImagen, generarHtmlInpage } from './plantillaInpage'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'
import JSZip from 'jszip'
import { procesarImagen } from '../../utils/procesamientoImagenes'

export default function Inpage() {
  // 🧠 ESTADOS
  const [bloquesContenido, setBloquesContenido] = useState('')
  const [archivosImagenes, setArchivosImagenes] = useState<File[]>([])
  const [datosCSV, setDatosCSV] = useState('')
  const [procesandoImagenes, setProcesandoImagenes] = useState(false)
  const [imagenesZip, setImagenesZip] = useState<Blob | null>(null)

  // Textos por imagen
  const [titulosImagenes, setTitulosImagenes] = useState<string[]>([])
  const [descripcionesImagenes, setDescripcionesImagenes] = useState<string[]>([])

  // Texto legal global
  const [textoLegal, setTextoLegal] = useState('')

  // 🛠️ Custom Hook
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ GENERAR HTML (derivado de estados)
  const htmlGenerado = useMemo(() => {
    if (!datosCSV.trim()) return ''

    const columnas = datosCSV.trim().replace(/\|$/, '').split(',')
    const sku = columnas[0]?.trim() || ''
    const nombre = columnas[1]?.trim() || ''
    const marca = columnas[2]?.trim() || ''
    const depto = columnas[4]?.trim() || ''

    if (!sku || !depto) return ''

    // Generar bloques <picture> por cada imagen — ahora cada uno en su propio .col-12
    const bloquesImagenesHtml = archivosImagenes
      .map((archivo, index) =>
        generarBloqueImagen(
          depto,
          sku,
          archivo.name,
          nombre,
          marca,
          index + 1,
          titulosImagenes[index] || '',
          descripcionesImagenes[index] || ''
        )
      )
      .join('\n')

    return generarHtmlInpage(bloquesContenido, bloquesImagenesHtml, textoLegal)
  }, [bloquesContenido, archivosImagenes, datosCSV, titulosImagenes, descripcionesImagenes, textoLegal])

  // ⚡ FUNCIÓN PUENTE
  const manejarAccion = useCallback(() => {
    if (htmlGenerado) {
      ejecutarCopia(htmlGenerado)
    }
  }, [htmlGenerado, ejecutarCopia])

  // 🤖 VIGILANTE AUTOMÁTICO — se dispara al cambiar el HTML generado
  useEffect(() => {
    if (htmlGenerado) {
      ejecutarCopia(htmlGenerado)
    }
  }, [htmlGenerado, ejecutarCopia])

  // 📁 MANEJAR SUBIDA DE IMÁGENES
  const manejarArchivos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const archivos = Array.from(e.target.files).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
      setArchivosImagenes(archivos)
      setImagenesZip(null)
      setProcesandoImagenes(true)
      const zip = new JSZip()
      for (const archivo of archivos) {
        try {
          const resultado = await procesarImagen(archivo, { ancho: 700, formato: 'webp', calidad: 0.8 })
          zip.file(resultado.nombre, resultado.blob)
        } catch {
          // El archivo original continúa disponible para generar el HTML.
        }
      }
      setImagenesZip(await zip.generateAsync({ type: 'blob' }))
      setProcesandoImagenes(false)
      // Inicializar arrays de títulos y descripciones vacíos
      setTitulosImagenes(new Array(archivos.length).fill(''))
      setDescripcionesImagenes(new Array(archivos.length).fill(''))
    }
  }

  // ✏️ ACTUALIZAR TÍTULO DE UNA IMAGEN
  const actualizarTitulo = (index: number, valor: string) => {
    setTitulosImagenes(prev => {
      const copia = [...prev]
      copia[index] = valor
      return copia
    })
  }

  // ✏️ ACTUALIZAR DESCRIPCIÓN DE UNA IMAGEN
  const actualizarDescripcion = (index: number, valor: string) => {
    setDescripcionesImagenes(prev => {
      const copia = [...prev]
      copia[index] = valor
      return copia
    })
  }

  // 🎨 MUNDO VISUAL
  return (
    <div className="card p-4 shadow-sm mb-4">
      {/* === PASO 1: Bloques de Contenido === */}
      <h5 className="card-title mb-3">Paso 1: Pegar bloques de contenido (HTML libre)</h5>
      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={4}
          placeholder="Pega tu HTML de contenido aquí (títulos, descripciones, etc.)..."
          value={bloquesContenido}
          onChange={(e) => setBloquesContenido(e.target.value)}
        />
      </div>

      {/* === PASO 2: Subir Imágenes === */}
      <h5 className="card-title mb-3">Paso 2: Subir imágenes del inpage</h5>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          multiple
          accept="image/*"
          onChange={manejarArchivos}
        />
        <small className="text-muted">
          Selecciona una o varias imágenes. Se usará el nombre del archivo para construir la ruta del CMS.
        </small>
        {procesandoImagenes && (
          <div className="alert alert-info mt-3 mb-0 py-2">Preparando imágenes optimizadas (700 px, WebP)...</div>
        )}
        {!procesandoImagenes && imagenesZip && (
          <div className="d-flex align-items-center gap-3 mt-3">
            <span className="small text-success">✓ Imágenes listas para descargar en WebP.</span>
            <button
              className="btn btn-outline-success btn-sm"
              type="button"
              onClick={() => {
                const url = URL.createObjectURL(imagenesZip)
                const enlace = document.createElement('a')
                enlace.href = url
                enlace.download = 'imagenes-inpage-webp.zip'
                enlace.click()
                URL.revokeObjectURL(url)
              }}
            >
              Descargar imágenes (.zip)
            </button>
          </div>
        )}
      </div>

      {/* Lista de archivos + formulario de títulos/descripciones por imagen */}
      {archivosImagenes.length > 0 && (
        <div className="mb-3">
          <p className="fw-bold mb-2">📁 Imágenes cargadas ({archivosImagenes.length}):</p>
          {archivosImagenes.map((archivo, i) => (
            <div key={`${archivo.name}-${i}`} className="card mb-2 border">
              <div className="card-body py-2 px-3">
                <p className="font-monospace mb-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                  {i + 1}. {archivo.name}
                </p>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={`Título <h2> (opcional)`}
                      value={titulosImagenes[i] || ''}
                      onChange={(e) => actualizarTitulo(i, e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={`Descripción <p> (opcional)`}
                      value={descripcionesImagenes[i] || ''}
                      onChange={(e) => actualizarDescripcion(i, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === PASO 3: Texto Legal === */}
      <h5 className="card-title mb-3">Paso 3: Texto legal (opcional)</h5>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={2}
          placeholder="Ej: *Precios válidos hasta agotar stock. Imágenes referenciales..."
          value={textoLegal}
          onChange={(e) => setTextoLegal(e.target.value)}
        />
      </div>

      {/* === PASO 4: CSV del Producto === */}
      <h5 className="card-title mb-3">Paso 4: Pegar datos del producto (CSV)</h5>
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura del CSV:</p>
        <div className="table-responsive mb-2">
          <table className="table table-bordered table-sm table-striped align-middle" style={{ fontSize: '0.85rem' }}>
            <thead className="table-dark">
              <tr>
                <th>SKU HITES</th>
                <th>NOMBRE</th>
                <th>MARCA</th>
                <th>PROVEEDOR</th>
                <th>DEPTO</th>
                <th>SECCIÓN</th>
                <th>FAMILIA</th>
              </tr>
            </thead>
            <tbody className="font-monospace">
              <tr>
                <td>981438001</td>
                <td>ASPIRADORA ARRASTRE TH-2202</td>
                <td>THOMAS</td>
                <td>LOS ROBLES S.A.</td>
                <td>ELECTRODOMESTICOS</td>
                <td>ASPIRADORAS</td>
                <td>ARRASTRE HASTA 1400W</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={2}
          placeholder="981438001,ASPIRADORA ARRASTRE TH-2202,THOMAS,LOS ROBLES S.A.,ELECTRODOMESTICOS,ASPIRADORAS,ARRASTRE HASTA 1400W"
          value={datosCSV}
          onChange={(e) => setDatosCSV(e.target.value)}
        />
      </div>

      {/* 🧩 BOTÓN MODULAR */}
      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />

      {/* Salida HTML */}
      {htmlGenerado && (
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">💻 Código HTML Resultante (Editable)</h5>
          </div>

          <textarea
            className="form-control font-monospace bg-dark text-warning"
            rows={12}
            value={htmlGenerado}
            readOnly
          />
        </div>
      )}
    </div>
  )
}
