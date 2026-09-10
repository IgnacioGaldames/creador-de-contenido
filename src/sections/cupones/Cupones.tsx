// src/sections/cupones/Cupones.tsx
import { useState, useEffect } from 'react'
import { obtenerPlantillaCupon } from './plantillaCupon'
import { scriptCaducidad } from './scriptCaducidad'
import { scriptCopiaCupon } from './scriptCopiaCupon'
import { obtenerPlantillaContador } from '../general/contador/plantillaContador'
import { obtenerScriptContador } from '../general/contador/scriptContador'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'
import cssCrudo from './estilosCupones.css?raw';
const sufijoSeccion = 'cupones'

const convertirFechaExcel = (numeroSerie: string) => {
  const dias = parseInt(numeroSerie, 10);
  if (isNaN(dias)) return '';
  const diasMilisegundos = (dias - 25569) * 86400 * 1000;
  const fecha = new Date(diasMilisegundos);
  const fechaAjustada = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
  const dia = String(fechaAjustada.getDate()).padStart(2, '0');
  const mes = String(fechaAjustada.getMonth() + 1).padStart(2, '0');
  const anio = fechaAjustada.getFullYear();
  return `${dia}-${mes}-${anio}`;
};

export default function Cupones() {
  // 🧠 ESTADOS BÁSICOS
  const [datosCsv, setDatosCsv] = useState('')
  const [htmlGenerado, setHtmlGenerado] = useState('')
  const [esCarrusel, setEsCarrusel] = useState(true)
  const [esContador, setEsContador] = useState(false)
  const [fechaContador, setFechaContador] = useState('2026-12-31T23:59')

  // 🛠️ INVOCAMOS EL HOOK
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ FUNCIÓN PARA GENERAR EL HTML
  const generarHTML = () => {
    
    if (!datosCsv.trim()) return ''

    const registros = datosCsv.split('|').filter(r => r.trim() !== '' && !r.includes('CSV: ESTADO'))

    const bloquesHTML = registros.map((registro, index) => {
      const columnas = registro.replace(/"/g, '').split(',')
      const estado = columnas[0]?.trim() || ''
      if (estado.toUpperCase() !== 'ACTIVO') return ''

      const departamento = columnas[1]?.trim() || ''
      const imagen = columnas[2]?.trim() || ''
      const titulo = columnas[3]?.trim() || ''
      const llamado = columnas[4]?.trim() || ''
      const cupon = columnas[5]?.trim() || ''
      const legal = columnas[6]?.trim() || ''
      //const fechaInicio = convertirFechaExcel(columnas[7]?.trim()) || ''
      const fechaTermino = convertirFechaExcel(columnas[8]?.trim()) || ''
      const idCatalogo = columnas[9]?.trim() || ''
      const link = columnas[10]?.trim() || ''

      return obtenerPlantillaCupon(esCarrusel, index, departamento, imagen, titulo, llamado, cupon, legal, fechaTermino, idCatalogo, link)
    }).filter(html => html !== '').join('')

    const contenidoInterno = esCarrusel
      ? `<div class="slider-cyber carrusel-active" data-slick-desktop="4" data-slick-tablet="4" data-slick-mobile="1">\n<!-- inicio cupones -->\n${bloquesHTML}\n<!-- fin cupones -->\n</div>`
      : `<div class="row" id="misCupones">\n<!-- inicio cupones -->\n${bloquesHTML}\n<!-- fin cupones -->\n</div>`

    const bloqueContador = esContador
      ? `<div class="row">\n      <div class="col-12">\n        ${obtenerPlantillaContador(esContador, sufijoSeccion)}\n      </div>\n    </div>\n    `
      : ''

    const scriptContadorFinal = esContador
      ? `\n${obtenerScriptContador(sufijoSeccion, fechaContador)}`
      : ''

    const contenedorFinal = `<style>
${cssCrudo}
</style><section class="container-fluid px-0 mt-15px mt-md-40px my-0 pb-0 pb-md-2" id="cupones">
<div class="row">
        <div class="container mb-1">
          <h2 class="text-black articulat-regular text-center headline">Cupones BLACK 
            <span class="articulat-heavy text-uppercase-">¡Dale un ahorro extra!</span>
          </h2>
        </div>
      </div>
  <div class="container articulat px-2 px-md-0">
    ${bloqueContador}${contenidoInterno}
  </div>
</section>
${scriptCaducidad}${scriptContadorFinal}
${scriptCopiaCupon}`

    setHtmlGenerado(contenedorFinal)
    return contenedorFinal // 👈 Devolvemos el HTML
  }

  // ⚡ FUNCIÓN PUENTE
  const manejarAccion = () => {
    const nuevoHtml = generarHTML()
    if (nuevoHtml) {
      ejecutarCopia(nuevoHtml)
    }
  }

  // 🤖 VIGILANTE AUTOMÁTICO
  useEffect(() => {
    if (datosCsv.trim()) {
      manejarAccion()
    } else {
      setHtmlGenerado('')
    }
  }, [datosCsv, esCarrusel, esContador, fechaContador])

  // 🎨 MUNDO VISUAL
  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="card-title mb-3">Sección Cupones: Pegar filas (CSV)</h5>
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura y Ejemplo de CSV:</p>
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-sm table-striped align-middle" style={{ fontSize: '0.85rem' }}>
            <thead className="table-dark">
              <tr>
                <th>ESTADO</th>
                <th>DEPARTAMENTO</th>
                <th>IMAGEN</th>
                <th>TITULO_PRINCIPAL</th>
                <th>LLAMADO_CUPON</th>
                <th>CUPON</th>
                <th>LEGAL</th>
                <th>FECHA_INICIO</th>
                <th>FECHA_TERMINO</th>
                <th>ID_CATALOGO</th>
                <th>LINK</th>
                <th>CSV</th>
              </tr>
            </thead>
            <tbody className="font-monospace">
              <tr>
                <td>ACTIVO</td>
                <td>dormitorio</td>
                <td>2026/black/cupones/logo-cupon-gen</td>
                <td>Ropa de cama</td>
                <td>10% dcto adicional</td>
                <td>RCH10</td>
                <td>Pagando con Tarjeta Hites<br />*Excluye productos Marketplace</td>
                <td>46104</td>
                <td>46595</td>
                <td>ropadecama</td>
                <td>/dormitorio/ropa-de-cama/</td>
                <td>"ACTIVO,2026/black/cupones/logo-cupon-gen,Ropa de cama,10% dcto adicional,RCH10,Pagando con Tarjeta Hites
                  *Excluye productos Marketplace,46104,46595,ropadecama,/dormitorio/ropa-de-cama/|"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Control de Estructura */}
      <div className="mb-3 d-flex align-items-center bg-white p-3 border rounded">
        <span className="me-3 fw-bold">Estructura visual:</span>
        <div className="form-check form-switch me-4 mb-0">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            id="toggleCarrusel"
            checked={esCarrusel}
            onChange={() => setEsCarrusel(!esCarrusel)}
          />
          <label className="form-check-label cursor-pointer" htmlFor="toggleCarrusel">
            {esCarrusel ? '🎡 Carrusel (Slider)' : '🔲 Grilla (Bloques)'}
          </label>
        </div>
      </div>

      {/* Control del Contador */}
      <div className="mb-3 bg-white p-3 border rounded">
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            id="toggleContador"
            checked={esContador}
            onChange={() => setEsContador(!esContador)}
          />
          <label className="form-check-label fw-bold cursor-pointer" htmlFor="toggleContador">
            ⏱️ Activar Contador de tiempo
          </label>
        </div>

        {esContador && (
          <div className="mt-3">
            <label htmlFor="fechaContador" className="form-label fw-bold">
              📅 Fecha y hora de término del contador:
            </label>
            <div className="input-group">
              <span className="input-group-text">📅</span>
              <input
                type="datetime-local"
                id="fechaContador"
                className="form-control"
                value={fechaContador}
                onChange={(e) => setFechaContador(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Entrada CSV */}
      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={5}
          placeholder="ACTIVO,2026/black/cupones/logo...,Ropa de cama..."
          value={datosCsv}
          onChange={(e) => setDatosCsv(e.target.value)}
        />
      </div>

      {/* 🧩 BOTÓN MODULAR UNIFICADO */}
      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />

      {/* Salida HTML */}
      {htmlGenerado && (
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">💻 Código HTML Resultante</h5>
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