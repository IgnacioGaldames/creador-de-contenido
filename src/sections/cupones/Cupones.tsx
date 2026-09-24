// src/sections/cupones/Cupones.tsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { obtenerPlantillaCupon } from './plantillaCupon'
import { scriptCaducidad } from './scriptCaducidad'
import { scriptCopiaCupon } from './scriptCopiaCupon'
import { obtenerPlantillaContador } from '../general/contador/plantillaContador'
import { obtenerScriptContador } from '../general/contador/scriptContador'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import SelectorContador from '../../components/SelectorContador'
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
  const [esCarrusel, setEsCarrusel] = useState(true)
  const [esContador, setEsContador] = useState(false)
  const [fechaContador, setFechaContador] = useState('2026-12-31T23:59')
  const [tituloSeccion, setTituloSeccion] = useState('Cupones BLACK \n            <span class="articulat-heavy text-uppercase-">¡Dale un ahorro extra!</span>')

  // 🖼️ ESTADOS IMAGEN TÍTULO
  const [imagenDesktop, setImagenDesktop] = useState<File | null>(null)
  const [imagenMobile, setImagenMobile] = useState<File | null>(null)
  const [rutaDesktop, setRutaDesktop] = useState('')
  const [rutaMobile, setRutaMobile] = useState('')

  // 📝 ESTADO TEXTO LEGAL
  const [textoLegal, setTextoLegal] = useState('')

  // 🎨 ESTADO COLOR/CLASE DE FONDO
  const [colorFondo, setColorFondo] = useState('')
  const [tipoFondo, setTipoFondo] = useState<'clase' | 'hex'>('clase')

  // 🛠️ INVOCAMOS EL HOOK
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  // 📎 Extraer nombre sin extensión para ruta CMS
  const extraerRutaCms = (archivo: File): string => {
    const nombre = archivo.name
    const sinExtension = nombre.substring(0, nombre.lastIndexOf('.')) || nombre
    return sinExtension
  }

  // 🖼️ Manejar subida de imagen desktop
  const manejarImagenDesktop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0] || null
    setImagenDesktop(archivo)
    if (archivo) setRutaDesktop(extraerRutaCms(archivo))
  }

  // 🖼️ Manejar subida de imagen mobile
  const manejarImagenMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0] || null
    setImagenMobile(archivo)
    if (archivo) setRutaMobile(extraerRutaCms(archivo))
  }

  // ⚙️ HTML DERIVADO
  const htmlGenerado = useMemo(() => {
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

    // Determinar bloque de título: imagen <picture> o texto <h2>
    const tieneImagenTitulo = rutaDesktop.trim() !== '' && rutaMobile.trim() !== ''
    const tieneTituloTexto = tituloSeccion.trim() !== ''

    let bloqueTitulo = ''
    if (tieneImagenTitulo) {
      const srcDesktop = `images/${rutaDesktop}.webp?$staticlink$`
      const srcMobile = `images/${rutaMobile}.webp?$staticlink$`
      bloqueTitulo = `    <div class="container">
      <div class="row">
        <div class="col-12 d-flex align-items-center">
          <picture class="d-none d-md-block order-2 order-md-1 mx-md-auto">
            <source data-size="mobile" media="(max-width: 767.98px)"
              srcset="${srcMobile}">
            <source data-size="desktop" media="(min-width: 768px)"
              srcset="${srcDesktop}">
            <img src="${srcDesktop}"
              class="img-fluid titulo" alt="${tieneTituloTexto ? tituloSeccion.replace(/<[^>]*>/g, '') : 'Cupones'}" title="${tieneTituloTexto ? tituloSeccion.replace(/<[^>]*>/g, '') : 'Cupones'}"
              data-department="cupones" data-position="1" data-size="12" data-zone="especiales" data-test="cuponera">
          </picture>
        </div>
      </div>
    </div>`
    } else if (tieneTituloTexto) {
      bloqueTitulo = `    <div class="container mb-1">
      <div class="row">
        <div class="col-12">
          <h2 class="text-black articulat-regular text-center headline">${tituloSeccion}</h2>
        </div>
      </div>
    </div>`
    }

    // Bloque legal
    const bloqueLegal = textoLegal.trim()
      ? `\n    <div class="container">\n      <div class="row">\n        <div class="col-12">\n          <p class="small text-center text-white">${textoLegal.trim()}</p>\n        </div>\n      </div>\n    </div>`
      : ''

    // Clase o estilo de fondo para el <section>
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

    return `<style>
${cssCrudo}
</style><section class="container-fluid gotham py-5${claseFondo}" id="cupones"${styleFondo}>
${bloqueTitulo}
  <div class="container articulat px-2 px-md-0">
    ${bloqueContador}${contenidoInterno}
  </div>${bloqueLegal}
</section>
${scriptCaducidad}${scriptContadorFinal}
${scriptCopiaCupon}`
  }, [datosCsv, esCarrusel, esContador, fechaContador, tituloSeccion, rutaDesktop, rutaMobile, textoLegal, colorFondo, tipoFondo])

  // ⚡ FUNCIÓN PUENTE (estabilizada con useCallback)
  const manejarAccion = useCallback(() => {
    if (htmlGenerado) {
      ejecutarCopia(htmlGenerado)
    }
  }, [htmlGenerado, ejecutarCopia])

  // 🤖 VIGILANTE AUTOMÁTICO — copia al clipboard cuando cambia el HTML
  useEffect(() => {
    if (htmlGenerado) {
      ejecutarCopia(htmlGenerado)
    }
  }, [htmlGenerado, ejecutarCopia])

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
      <SelectorContador 
        esContador={esContador}
        setEsContador={setEsContador}
        fechaContador={fechaContador}
        setFechaContador={setFechaContador}
      />

      {/* 🎨 Color / Clase de Fondo */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label className="form-label fw-bold">🎨 Fondo del &lt;section&gt; (opcional):</label>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${tipoFondo === 'clase' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTipoFondo('clase')}
              >
                Clase CSS
              </button>
              <button
                type="button"
                className={`btn btn-sm ${tipoFondo === 'hex' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTipoFondo('hex')}
              >
                Color Hex
              </button>
            </div>
          </div>
          <div className="col">
            <div className="input-group">
              {tipoFondo === 'hex' && (
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={colorFondo.startsWith('#') ? colorFondo : '#000000'}
                  onChange={(e) => setColorFondo(e.target.value)}
                  title="Seleccionar color"
                />
              )}
              <input
                type="text"
                className="form-control font-monospace"
                placeholder={tipoFondo === 'clase' ? 'ej: bg-cyber-azul' : 'ej: #1a2b3c'}
                value={colorFondo}
                onChange={(e) => setColorFondo(e.target.value)}
              />
            </div>
          </div>
          {tipoFondo === 'hex' && colorFondo.trim() && (
            <div className="col-auto">
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  backgroundColor: colorFondo.startsWith('#') ? colorFondo : `#${colorFondo}`,
                }}
                title="Preview del color"
              />
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ Imagen de Título */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label className="form-label fw-bold">🖼️ Imagen de título (opcional, reemplaza el H2):</label>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Desktop:</label>
            <input
              type="file"
              className="form-control form-control-sm"
              accept="image/*"
              onChange={manejarImagenDesktop}
            />
            {imagenDesktop && (
              <input
                type="text"
                className="form-control form-control-sm font-monospace mt-1"
                placeholder="Ruta CMS (se autocompleta)"
                value={rutaDesktop}
                onChange={(e) => setRutaDesktop(e.target.value)}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Mobile:</label>
            <input
              type="file"
              className="form-control form-control-sm"
              accept="image/*"
              onChange={manejarImagenMobile}
            />
            {imagenMobile && (
              <input
                type="text"
                className="form-control form-control-sm font-monospace mt-1"
                placeholder="Ruta CMS (se autocompleta)"
                value={rutaMobile}
                onChange={(e) => setRutaMobile(e.target.value)}
              />
            )}
          </div>
        </div>
        {rutaDesktop && rutaMobile && (
          <div className="alert alert-success mt-2 mb-0 py-1 small">
            ✅ Se usará imagen <code>&lt;picture&gt;</code> en lugar del título de texto.
          </div>
        )}
      </div>

      {/* ✍️ Título de la Sección (solo se usa si NO hay imagen de título) */}
      {!(rutaDesktop.trim() && rutaMobile.trim()) && (
        <div className="mb-3 bg-white p-3 border rounded">
          <label htmlFor="tituloSeccion" className="form-label fw-bold">
            ✍️ Título de la sección (HTML permitido):
          </label>
          <textarea
            id="tituloSeccion"
            className="form-control font-monospace"
            rows={2}
            value={tituloSeccion}
            onChange={(e) => setTituloSeccion(e.target.value)}
          />
        </div>
      )}

      {/* 📝 Texto Legal */}
      <div className="mb-3 bg-white p-3 border rounded">
        <label htmlFor="textoLegal" className="form-label fw-bold">
          ⚖️ Texto legal al final de los cupones (opcional):
        </label>
        <input
          type="text"
          id="textoLegal"
          className="form-control"
          placeholder="Ej: *Excluye productos marketplace"
          value={textoLegal}
          onChange={(e) => setTextoLegal(e.target.value)}
        />
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
            readOnly
          />
        </div>
      )}
    </div>
  )
}