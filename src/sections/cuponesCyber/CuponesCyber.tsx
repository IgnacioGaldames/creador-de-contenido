// src/sections/cuponesCyber/CuponesCyber.tsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { obtenerPlantillaCuponCyber, obtenerHtmlCuponesCyber } from './plantillaCuponCyber'
import { scriptCaducidad } from '../cupones/scriptCaducidad'
import { obtenerScriptCopiaCuponCyber } from './scriptCopiaCuponCyber'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'
import { convertirFechaExcel } from '../../utils/fechas'

const clavePrefijoImagen = 'cupones-cyber-prefijo-imagen'

export default function CuponesCyber() {
  // 🧠 ESTADOS BÁSICOS
  const [datosCsv, setDatosCsv] = useState('')
  const [esCarrusel, setEsCarrusel] = useState(true)
  const [mensajeCompartir, setMensajeCompartir] = useState('¡Cupones CYBER en Hites.com!')
  const [textoLegal, setTextoLegal] = useState('')

  // 🎨 FONDO
  const [colorFondo, setColorFondo] = useState('bg-cuponera-cyber')
  const [tipoFondo, setTipoFondo] = useState<'clase' | 'hex'>('clase')

  // 🖼️ BANNER — configuración del bloque título tipo cuponera cyber
  const [linkBanner, setLinkBanner] = useState('/cuponera-cyber.html')
  const [srcLogoBanner, setSrcLogoBanner] = useState('images/Home/2026/10/cyber/cuponera-cyber.png')
  const [textoBanner, setTextoBanner] = useState('¡Activa tus cupones y')
  const [spanTextoBanner, setSpanTextoBanner] = useState('ahorra mucho más!')
  const [srcIconoBanner, setSrcIconoBanner] = useState('images/Home/2026/10/cyber/icono-cupones.png')
  const [textoCta, setTextoCta] = useState('¡Los quiero!')

  const [prefijoImagen, setPrefijoImagen] = useState(
    () => localStorage.getItem(clavePrefijoImagen) ?? ''
  )

  useEffect(() => {
    localStorage.setItem(clavePrefijoImagen, prefijoImagen)
  }, [prefijoImagen])

  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // ⚙️ HTML DERIVADO
  const htmlGenerado = useMemo(() => {
    if (!datosCsv.trim()) return ''

    const registros = datosCsv.split('|').filter(r => r.trim() !== '' && !r.includes('CSV: ESTADO'))

    const bloquesHTML = registros.map((registro, index) => {
      const columnas = registro.replace(/"/g, '').split(',')
      const estado = columnas[0]?.trim() || ''
      if (estado.toUpperCase() !== 'ACTIVO') return ''

      const posicion = columnas[1]?.trim() || ''
      // columnas[2] = DEPARTAMENTO (no se usa)
      const imagen = columnas[3]?.trim() || ''
      const titulo = columnas[4]?.trim() || ''
      const llamado = columnas[5]?.trim() || ''
      const cupon = columnas[6]?.trim() || ''
      const legal = columnas[7]?.trim() || ''
      // columnas[8] = FECHA_INICIO (no usada visualmente)
      const fechaTermino = convertirFechaExcel(columnas[9]?.trim() ?? '') || ''
      const idCatalogo = columnas[10]?.trim() || ''
      const link = columnas[11]?.trim() || ''

      return obtenerPlantillaCuponCyber(esCarrusel, index, posicion, imagen, titulo, llamado, cupon, legal, fechaTermino, idCatalogo, link)
    }).filter(html => html !== '').join('')

    // Clase o estilo de fondo
    const fondoLimpio = colorFondo.trim()
    let claseFondo = ''
    let styleFondo = ''
    if (fondoLimpio) {
      if (tipoFondo === 'hex') {
        const hexFinal = fondoLimpio.startsWith('#') ? fondoLimpio : '#' + fondoLimpio
        styleFondo = ` style="background-color: ${hexFinal};"`
      } else {
        claseFondo = ` ${fondoLimpio}`
      }
    }

    const bannerConfig = { linkBanner, srcLogoBanner, textoBanner, spanTextoBanner, srcIconoBanner, textoCta }

    return `${obtenerHtmlCuponesCyber(esCarrusel, bloquesHTML, bannerConfig, textoLegal, claseFondo, styleFondo)}
${scriptCaducidad}
${obtenerScriptCopiaCuponCyber(mensajeCompartir)}`
  }, [datosCsv, esCarrusel, mensajeCompartir, textoLegal, colorFondo, tipoFondo,
    linkBanner, srcLogoBanner, textoBanner, spanTextoBanner, srcIconoBanner, textoCta])

  const manejarAccion = useCallback(() => {
    if (htmlGenerado) ejecutarCopia(htmlGenerado)
  }, [htmlGenerado, ejecutarCopia])

  // Auto-copia al generar
  useEffect(() => {
    if (htmlGenerado) ejecutarCopia(htmlGenerado)
  }, [htmlGenerado, ejecutarCopia])

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="card-title mb-3">🛒 Cuponera Cyber: Pegar filas (CSV)</h5>

      {/* 📋 Estructura CSV */}
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura y Ejemplo de CSV:</p>
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-sm table-striped align-middle" style={{ fontSize: '0.85rem' }}>
            <thead className="table-dark">
              <tr>
                <th>ESTADO</th>
                <th>POSICION</th>
                <th>DEPARTAMENTO</th>
                <th>IMAGEN</th>
                <th>TITULO</th>
                <th>LLAMADO_CUPON</th>
                <th>CUPON</th>
                <th>LEGAL</th>
                <th>FECHA_INICIO</th>
                <th>FECHA_TERMINO</th>
                <th>ID_CATALOGO</th>
                <th>LINK</th>
                <th>IMAGEN_REP</th>
                <th>CSV concatenado</th>
              </tr>
            </thead>
            <tbody className="font-monospace">
              <tr>
                <td>ACTIVO</td>
                <td>CUPON-01</td>
                <td>MALETERIA</td>
                <td>maletas.png</td>
                <td>MALETAS</td>
                <td>10% dcto adicional</td>
                <td>MALETAS_10</td>
                <td>*Excluye marketplace</td>
                <td>46295</td>
                <td>46302</td>
                <td>maletas</td>
                <td>https://www.hites.com/hogar/maleteria/maletas/</td>
                <td>maletas.png</td>
                <td><code>ACTIVO,CUPON-01,MALETERIA,maletas.png,MALETAS,10% dcto adicional,MALETAS_10,*Excluye marketplace,46295,46302,maletas,https://www.hites.com/hogar/maleteria/maletas/,maletas.png|</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚙️ Estructura visual */}
      <div className="mb-3 d-flex align-items-center bg-white p-3 border rounded">
        <span className="me-3 fw-bold">Estructura visual:</span>
        <div className="form-check form-switch me-4 mb-0">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            id="toggleCarruselCyber"
            checked={esCarrusel}
            onChange={() => setEsCarrusel(!esCarrusel)}
          />
          <label className="form-check-label cursor-pointer" htmlFor="toggleCarruselCyber">
            {esCarrusel ? '🎡 Carrusel (Slider)' : '🔲 Grilla (Bloques)'}
          </label>
        </div>
      </div>

      {/* 🎨 Fondo */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label className="form-label fw-bold">🎨 Fondo del &lt;section&gt;:</label>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${tipoFondo === 'clase' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTipoFondo('clase')}
              >Clase CSS</button>
              <button
                type="button"
                className={`btn btn-sm ${tipoFondo === 'hex' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTipoFondo('hex')}
              >Color Hex</button>
            </div>
          </div>
          <div className="col">
            <div className="input-group">
              {tipoFondo === 'hex' && (
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={colorFondo.startsWith('#') ? colorFondo : '#020b24'}
                  onChange={(e) => setColorFondo(e.target.value)}
                  title="Seleccionar color"
                />
              )}
              <input
                type="text"
                className="form-control font-monospace"
                placeholder={tipoFondo === 'clase' ? 'ej: bg-cuponera-cyber' : 'ej: #020b24'}
                value={colorFondo}
                onChange={(e) => setColorFondo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ Banner Cuponera */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label className="form-label fw-bold">🖼️ Banner tipo cuponera (encabezado de sección):</label>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Link del banner:</label>
            <input type="text" className="form-control form-control-sm font-monospace"
              placeholder="/cuponera-cyber.html"
              value={linkBanner} onChange={(e) => setLinkBanner(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Ruta logo banner (sin ?$staticlink$):</label>
            <input type="text" className="form-control form-control-sm font-monospace"
              placeholder="images/Home/2026/10/cyber/cuponera-cyber.png"
              value={srcLogoBanner} onChange={(e) => setSrcLogoBanner(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Texto del banner:</label>
            <input type="text" className="form-control form-control-sm"
              placeholder="¡Activa tus cupones y"
              value={textoBanner} onChange={(e) => setTextoBanner(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Span destacado (naranja):</label>
            <input type="text" className="form-control form-control-sm"
              placeholder="ahorra mucho más!"
              value={spanTextoBanner} onChange={(e) => setSpanTextoBanner(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Ruta ícono animado (sin ?$staticlink$):</label>
            <input type="text" className="form-control form-control-sm font-monospace"
              placeholder="images/Home/2026/10/cyber/icono-cupones.png"
              value={srcIconoBanner} onChange={(e) => setSrcIconoBanner(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Texto botón CTA:</label>
            <input type="text" className="form-control form-control-sm"
              placeholder="¡Los quiero!"
              value={textoCta} onChange={(e) => setTextoCta(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 💬 Mensaje para compartir */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label htmlFor="mensajeCompartirCyber" className="form-label fw-bold">
          💬 Mensaje para compartir:
        </label>
        <input
          type="text"
          id="mensajeCompartirCyber"
          className="form-control"
          placeholder="Ej: ¡Cupones CYBER en Hites.com!"
          value={mensajeCompartir}
          onChange={(e) => setMensajeCompartir(e.target.value)}
        />
      </div>

      {/* ⚖️ Texto Legal */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label htmlFor="textoLegalCyber" className="form-label fw-bold">
          ⚖️ Texto legal al final (opcional):
        </label>
        <input
          type="text"
          id="textoLegalCyber"
          className="form-control"
          placeholder="Ej: *Excluye productos marketplace"
          value={textoLegal}
          onChange={(e) => setTextoLegal(e.target.value)}
        />
      </div>

      {/* 📋 Prefijo ruta imagen */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label htmlFor="prefijoImagenCyber" className="form-label fw-bold">
          🗂️ Prefijo de ruta de imagen (usado si no viene ruta completa):
        </label>
        <input
          type="text"
          id="prefijoImagenCyber"
          className="form-control font-monospace"
          placeholder="images/Landing/cupones//"
          value={prefijoImagen}
          onChange={(e) => setPrefijoImagen(e.target.value)}
        />
      </div>

      {/* 📄 Entrada CSV */}
      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={5}
          placeholder="ACTIVO,CUPON-01,MALETERIA,maletas.png,MALETAS,10% dcto adicional,MALETAS_10,*Excluye marketplace,46295,46302,maletas,https://www.hites.com/hogar/maleteria/maletas/,maletas.png|"
          value={datosCsv}
          onChange={(e) => setDatosCsv(e.target.value)}
        />
      </div>

      {/* 🧩 Botón */}
      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />

      {/* 💻 Salida HTML */}
      {htmlGenerado && (
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">💻 Código HTML Resultante</h5>
          </div>
          <textarea
            className="form-control font-monospace bg-dark text-warning"
            rows={10}
            value={htmlGenerado}
            readOnly
          />
        </div>
      )}
    </div>
  )
}
