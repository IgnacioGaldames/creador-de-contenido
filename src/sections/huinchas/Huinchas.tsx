// src/sections/huinchas/Huinchas.tsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { obtenerHtmlHuincha, obtenerHtmlHuinchasCompleto } from './plantillaHuinchas'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'

const obtenerRegistros = (texto: string): string[][] => {
  const primeraFila = texto.split(/\r?\n/).find(fila => fila.trim() !== '') ?? ''
  const separadorColumna = primeraFila.includes('\t') ? '\t' : ','
  const separadorFila = separadorColumna === ',' && texto.includes('|')
    ? '|'
    : null
  const registros: string[][] = []
  let registro: string[] = []
  let columna = ''
  let dentroDeComillas = false

  for (let indice = 0; indice < texto.length; indice += 1) {
    const caracter = texto[indice]

    if (caracter === '"') {
      if (dentroDeComillas && texto[indice + 1] === '"') {
        columna += '"'
        indice += 1
      } else {
        dentroDeComillas = !dentroDeComillas
      }
    } else if (!dentroDeComillas && caracter === separadorColumna) {
      registro.push(columna.trim())
      columna = ''
    } else if (!dentroDeComillas && (caracter === '\n' || caracter === '\r' || caracter === separadorFila)) {
      if (caracter === '\r' && texto[indice + 1] === '\n') indice += 1
      registro.push(columna.trim())
      if (registro.some(celda => celda !== '')) registros.push(registro)
      registro = []
      columna = ''
    } else {
      columna += caracter
    }
  }

  registro.push(columna.trim())
  if (registro.some(celda => celda !== '')) registros.push(registro)
  return registros
}

export default function Huinchas() {
  const [datosExcel, setDatosExcel] = useState('')
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ Columnas del CSV (índice 0-based):
  // 0: TAMAÑO, 1: KV GRÁFICA, 2: ÁREA/DEPARTAMENTO, 3: RUTA_IMAGEN,
  // 4: CATEGORÍA HTML, 5: LLAMADO HTML, 6: MOBILE, 7: SKU/IMAGEN,
  // 8: MARCA, 9: NOMBRE PRODUCTO, 10: ATRIBUTOS, 11: PRECIO NORMAL,
  // 12: PRECIO OFERTA, 13: PRECIO TH, 14: PRECIO CUPÓN, 15: CUOTA/CTC,
  // 16: DCTO OFERTA, 17: DCTO TH, 18: RIBBON, 19: ID CATALOGO,
  // 20: LINK, 21: LEGAL (opcional)

  const htmlGenerado = useMemo(() => {
    if (!datosExcel.trim()) return ''

    const registros = obtenerRegistros(datosExcel)
    const primeraColumna = registros[0]?.[0]?.replace(/^\uFEFF/, '').trim().toLocaleUpperCase('es')
    const filas = primeraColumna === 'TAMAÑO' ? registros.slice(1) : registros

    const bloques = filas
      .map(columnas => {
        const rutaImagen       = columnas[3]?.trim() || ''
        const kvGrafica        = columnas[1]?.trim() || ''
        const areaDepartamento = columnas[2]?.trim() || ''
        const categoriaHtml    = columnas[4]?.trim() || ''
        const llamadoHtml      = columnas[5]?.trim() || ''
        const tieneMobile      = columnas[6]?.trim().toUpperCase() === 'SI'
        const link             = columnas[20]?.trim() || '#'
        const legal            = columnas[21]?.trim() || ''

        return obtenerHtmlHuincha(
          rutaImagen,
          kvGrafica,
          categoriaHtml,
          llamadoHtml,
          areaDepartamento,
          link,
          tieneMobile,
          legal
        )
      })
      .filter(b => b !== '')
      .join('\n')

    if (!bloques) return ''

    return obtenerHtmlHuinchasCompleto(bloques)
  }, [datosExcel])

  const manejarAccion = useCallback(() => {
    if (htmlGenerado) ejecutarCopia(htmlGenerado)
  }, [htmlGenerado, ejecutarCopia])

  useEffect(() => {
    if (htmlGenerado) ejecutarCopia(htmlGenerado)
  }, [htmlGenerado, ejecutarCopia])

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="card-title mb-3">Paso 1: Pegar filas de huinchas (Hero Banners)</h5>

      {/* Referencia de estructura CSV */}
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura del CSV (columna 22: LEGAL, opcional):</p>
        <div className="table-responsive mb-3">
          <table className="table table-bordered table-sm table-striped align-middle" style={{ fontSize: '0.8rem' }}>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>CAMPO</th>
                <th>EJEMPLO</th>
              </tr>
            </thead>
            <tbody className="font-monospace">
              {[
                ['1', 'TAMAÑO', '4 DESK - 2 MOB'],
                ['2', 'KV GRÁFICA', 'CYBER'],
                ['3', 'ÁREA / DEPARTAMENTO', 'TELEFONÍA'],
                ['4', 'RUTA_IMAGEN', 'images/Home/2026/10/papitas/hero/banner-smartphones_'],
                ['5', 'CATEGORÍA HTML', 'Celulares'],
                ['6', 'LLAMADO HTML', 'Hasta 55% dscto'],
                ['7', 'MOBILE', 'SI'],
                ['21', 'LINK', '/celulares/smartphones/smartphone/'],
                ['22', 'LEGAL (opcional)', '10 cuotas sin interés en productos seleccionados'],
              ].map(([idx, campo, ej]) => (
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>{campo}</td>
                  <td>{ej}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
          <strong>Ejemplo CSV:</strong>
        </p>
        <code className="d-block bg-light p-2 rounded" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
          4 DESK - 2 MOB,CYBER,TELEFONÍA,images/Home/2026/10/papitas/hero/banner-smartphones_,Celulares,Hasta 55% dscto,SI,959678001,HONOR,400 Lite 256 GB / 5G,,329990,239990,,,,0,272735537440528,1,,/celulares/smartphones/smartphone/,"10 cuotas sin interés con Tarjeta Hites | CAE 1,44"|
        </code>
      </div>

      {/* Entrada CSV */}
      <div className="mb-3">
        <textarea
          id="huinchas-textarea-input"
          className="form-control font-monospace"
          rows={5}
          placeholder="Pega el CSV completo, con o sin encabezado (también acepta filas tabuladas)..."
          value={datosExcel}
          onChange={(e) => setDatosExcel(e.target.value)}
        />
      </div>

      {/* Botón unificado */}
      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />

      {/* Salida HTML */}
      {htmlGenerado && (
        <div className="mt-4">
          <h5 className="card-title mb-3">💻 Código HTML Resultante</h5>
          <textarea
            id="huinchas-textarea-output"
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
