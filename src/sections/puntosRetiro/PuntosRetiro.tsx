// src/sections/puntosRetiro/PuntosRetiro.tsx
import { useState, useEffect } from 'react'
import { obtenerPlantillaPuntosRetiro } from './plantillaPuntosRetiro'
import BotonGenerarCopiar from '../../components/BotonGenerarCopiar'
import { useProcesarYCopiar } from '../../hooks/useProcesarYCopiar'

export default function PuntosRetiro() {
  const [datosCsv, setDatosCsv] = useState('')
  const [htmlGenerado, setHtmlGenerado] = useState('')
  const { ejecutarCopia, copiado, generado } = useProcesarYCopiar()

  const generarHTML = () => {
    if (!datosCsv.trim()) return ''

    // Separamos el texto por pipes "|" o saltos de línea (dependiendo cómo se copie de excel)
    // Para ser robustos, primero reemplazamos saltos de línea por pipes si es que pegan directo.
    const textoNormalizado = datosCsv.replace(/\n/g, '|');
    const registros = textoNormalizado.split('|').filter(r => r.trim() !== '' && !r.includes('ID,ESTADO'));

    const arrayTiendas = registros.map((registro) => {
      const columnas = registro.split(',');
      const estado = columnas[1]?.trim() || '';
      
      if (estado.toUpperCase() !== 'ACTIVO') return null;

      const nombre = columnas[2]?.trim() || '';
      const direccionBase = columnas[4]?.trim() || '';
      const comuna = columnas[5]?.trim() || '';
      const zonaRaw = columnas[7]?.trim().toLowerCase() || 'santiago';
      
      // Normalizar el tipo para que coincida con el data-tipo del HTML
      let tipoColumna = (columnas[3]?.trim() || '').toLowerCase();
      let tipoNormalizado = 'hites'; // Por defecto
      if (tipoColumna.includes('stk') || tipoColumna.includes('starken')) {
        tipoNormalizado = 'starken';
      } else if (tipoColumna.includes('blu') || tipoColumna.includes('blue')) {
        tipoNormalizado = 'blueexpress';
      }

      return {
        nombre: nombre,
        direccion: `${direccionBase}, ${comuna}`,
        zona: zonaRaw,
        tipo: tipoNormalizado
      };
    }).filter(item => item !== null); // Filtramos los nulos (Inactivos)

    // Convertimos el Arreglo de Javascript a un String JSON legible
    const jsonString = JSON.stringify(arrayTiendas, null, 2);

    // Enviamos este String JSON a nuestra plantilla
    const htmlFinal = obtenerPlantillaPuntosRetiro(jsonString);
    setHtmlGenerado(htmlFinal);
    return htmlFinal;
  }

  const manejarAccion = () => {
    const nuevoHtml = generarHTML()
    if (nuevoHtml) {
      ejecutarCopia(nuevoHtml)
    }
  }

  useEffect(() => {
    if (datosCsv.trim()) {
      manejarAccion()
    } else {
      setHtmlGenerado('')
    }
  }, [datosCsv])

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="card-title mb-3">Sección Puntos de Retiro: Pegar filas (CSV)</h5>
      
      <div className="mb-3 bg-white p-3 border rounded">
        <p className="card-text mb-2 fw-bold">Estructura esperada de la fórmula Excel:</p>
        <code className="d-block bg-light p-2 mb-2 text-muted">
          =CONCATENAR(A2; ","; B2; ","; C2; ","; D2; ","; E2; ","; F2; ","; G2; ","; H2; "|")
        </code>
        <p className="small mb-0">Orden: ID, ESTADO, NOMBRE, TIPO, DIRECCION, COMUNA, REGION, ZONA</p>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control font-monospace"
          rows={6}
          placeholder="1,Activo,Hites Paseo Puente 696,THI,Paseo Puente 696, Santiago Centro,Santiago,Metropolitana,Centro|"
          value={datosCsv}
          onChange={(e) => setDatosCsv(e.target.value)}
        />
      </div>

      <BotonGenerarCopiar
        alHacerClic={manejarAccion}
        generado={generado}
        copiado={copiado}
      />

      {htmlGenerado && (
        <div className="mt-2">
          <h5 className="card-title mb-2">Código HTML Resultante</h5>
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