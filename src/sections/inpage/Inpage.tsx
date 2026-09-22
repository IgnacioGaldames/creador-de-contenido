// src/sections/inpage/Inpage.tsx
import { useState, useEffect } from 'react'
import { generarBloqueImagen, generarHtmlInpage } from './plantillaInpage'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'

export default function Inpage() {
  // 🧠 ESTADOS
  const [bloquesContenido, setBloquesContenido] = useState('')
  const [archivosImagenes, setArchivosImagenes] = useState<File[]>([])
  const [datosCSV, setDatosCSV] = useState('')
  const [htmlGenerado, setHtmlGenerado] = useState('')

  // 🛠️ Custom Hook
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ GENERAR HTML
  const generarHTML = (): string => {
    if (!datosCSV.trim()) return ''

    // Parsear CSV — una sola línea: SKU,NOMBRE,MARCA,PROVEEDOR,DEPTO,SECCIÓN,FAMILIA
    const columnas = datosCSV.trim().replace(/\|$/, '').split(',')
    const sku = columnas[0]?.trim() || ''
    const nombre = columnas[1]?.trim() || ''
    const marca = columnas[2]?.trim() || ''
    // columnas[3] = PROVEEDOR (no se usa en el template)
    const depto = columnas[4]?.trim() || ''
    // columnas[5] = SECCIÓN, columnas[6] = FAMILIA (no se usan en el template)

    if (!sku || !depto) return ''

    // Generar bloques <picture> por cada imagen subida
    const bloquesImagenesHtml = archivosImagenes
      .map((archivo, index) =>
        generarBloqueImagen(depto, sku, archivo.name, nombre, marca, index + 1)
      )
      .join('\n')

    const htmlFinal = generarHtmlInpage(bloquesContenido, bloquesImagenesHtml)
    setHtmlGenerado(htmlFinal)
    return htmlFinal
  }

  // ⚡ FUNCIÓN PUENTE
  const manejarAccion = () => {
    const nuevoHtml = generarHTML()
    if (nuevoHtml) {
      ejecutarCopia(nuevoHtml)
    }
  }

  // 🤖 VIGILANTE AUTOMÁTICO — se dispara al cambiar cualquier input
  useEffect(() => {
    if (datosCSV.trim() !== '') {
      manejarAccion()
    } else {
      setHtmlGenerado('')
    }
  }, [bloquesContenido, archivosImagenes, datosCSV])

  // 📁 MANEJAR SUBIDA DE IMÁGENES
  const manejarArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convertir FileList a array y ordenar por nombre
      const archivos = Array.from(e.target.files).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
      setArchivosImagenes(archivos)
    }
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
      </div>

      {/* Lista visual de archivos */}
      {archivosImagenes.length > 0 && (
        <div className="mb-3">
          <p className="fw-bold mb-1">📁 Imágenes cargadas ({archivosImagenes.length}):</p>
          <ul className="list-group list-group-flush" style={{ fontSize: '0.85rem' }}>
            {archivosImagenes.map((archivo, i) => (
              <li key={`${archivo.name}-${i}`} className="list-group-item py-1 font-monospace">
                {i + 1}. {archivo.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* === PASO 3: CSV del Producto === */}
      <h5 className="card-title mb-3">Paso 3: Pegar datos del producto (CSV)</h5>
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
            onChange={(e) => setHtmlGenerado(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
