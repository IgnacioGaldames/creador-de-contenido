// src/sections/cabeceras/Cabeceras.tsx
import { useState, useEffect } from 'react'
import { obtenerHtmlCabecera, obtenerBloqueMarca } from './plantillaHtml'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar' // 👈 1. Importamos nuestra nueva herramienta

//const sufijoSeccion = "cabeceras"

export default function Cabeceras() {
  // 🧠 ESTADOS BÁSICOS (¡Adiós a copiado y generado de aquí!)
  const [datosExcel, setDatosExcel] = useState('')
  const [htmlGenerado, setHtmlGenerado] = useState('')

  // 🛠️ 2. Invocamos nuestro Custom Hook para obtener la función y los estados visuales
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ FUNCIÓN PARA GENERAR EL HTML
  const generarHTML = () => {
    if (!datosExcel.trim()) return ''

    const registros = datosExcel.split('|')

    const bloquesImagenes = registros
      .filter(registro => {
        const columnas = registro.trim().split(',')
        return columnas[0]?.trim() === 'activo' && columnas[1]?.trim() === 'imagen'
      })
      .map(marca => {
        const columnas = marca.trim().split(',')
        const posicion = columnas[2]?.trim()
        const urlImagen = `${columnas[3]?.trim()}.webp?$staticlink$`
        const categoria = columnas[4]?.trim() || ''
        const nombreMarca = columnas[5]?.trim() || 'Marca'
        const linkUrl = columnas[6]?.trim() || '#'

        return obtenerBloqueMarca('imagen', posicion, urlImagen, categoria, nombreMarca, linkUrl)
      })
      .filter(bloque => bloque !== '')
      .join('\n')

    const bloquesEnlaces = registros
      .filter(registro => {
        const columnas = registro.trim().split(',')
        return columnas[0]?.trim() === 'activo' && columnas[1]?.trim() === 'enlace'
      })
      .map(enlace => {
        const columnas = enlace.trim().split(',')
        const textoEnlace = columnas[5]?.trim() || 'Enlace'
        const linkUrl = columnas[6]?.trim() || '#'

        return obtenerBloqueMarca('enlace', '', '', '', textoEnlace, linkUrl)
      })
      .filter(bloque => bloque !== '')
      .join('\n')

    const htmlFinal = obtenerHtmlCabecera(bloquesImagenes, bloquesEnlaces)

    setHtmlGenerado(htmlFinal)
    return htmlFinal // 👈 Es vital devolver (return) el texto para usarlo inmediatamente
  }

  // ⚡ 3. FUNCIÓN PUENTE: Genera el código y le pide al Hook que lo copie
  const manejarAccion = () => {
    const nuevoHtml = generarHTML() // Guardamos lo que devuelve la función
    if (nuevoHtml) {
      ejecutarCopia(nuevoHtml) // Le entregamos el texto a nuestro hook
    }
  }

  // 🤖 VIGILANTE AUTOMÁTICO
  useEffect(() => {
    if (datosExcel.trim() !== '') {
      manejarAccion()
    } else {
      setHtmlGenerado('')
    }
  }, [datosExcel])

  // 🎨 MUNDO VISUAL
  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="card-title mb-3">Paso 1: Pegar filas de marcas (Cabeceras)</h5>
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura y Ejemplo de CSV:</p>
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-sm table-striped align-middle" style={{ fontSize: '0.85rem' }}>
            <thead className="table-dark">
              <tr>
                <th>ESTADO</th>
                <th>TIPO</th>
                <th>POSICIÓN</th>
                <th>IMAGEN</th>
                <th>CATEGORÍA</th>
                <th>BOTÓN (ALT/TITLE)</th>
                <th>LINK URL</th>
                <th>CSV</th>
              </tr>
            </thead>
            <tbody className="font-monospace">
              <tr>
                <td>activo</td>
                <td>imagen</td>
                <td>1</td>
                <td>images/cabeceras/2026/tecnologia/cab-quick-access-32_</td>
                <td>tecnologia</td>
                <td>32" o menos</td>
                <td>/tecnologia/tv-video/32-o-menos/</td>
                <td>activo,imagen,1,images/cabeceras/2026/tecnologia/cab-quick-access-32_,tecnologia,32" o menos,/tecnologia/tv-video/32-o-menos/|</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Entrada CSV */}
      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={5}
          placeholder="Pega tu CSV aquí..."
          value={datosExcel}
          onChange={(e) => setDatosExcel(e.target.value)}
        />
      </div>

      {/* 🧩 BOTÓN MODULAR UNIFICADO */}
      <BotonGenerarCopiar
        alHacerClic={manejarAccion} // 👈 Pasamos nuestra nueva función puente
        generado={generado}         // 👈 Viene directo del Hook
        copiado={copiado}           // 👈 Viene directo del Hook
      />

      {/* Salida HTML */}
      {htmlGenerado && (
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">💻 Código HTML Resultante (Editable)</h5>
          </div>

          <textarea
            className="form-control font-monospace bg-dark text-warning"
            rows={10}
            value={htmlGenerado}
            onChange={(e) => setHtmlGenerado(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}