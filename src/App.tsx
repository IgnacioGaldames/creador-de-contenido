// src/App.tsx
import { useState } from 'react'
import Cabeceras from './sections/cabeceras/Cabeceras'
import Cupones from './sections/cupones/Cupones'
import Inpage from './sections/inpage/Inpage'
import PuntosRetiro from './sections/puntosRetiro/PuntosRetiro'

const SECCIONES_DISPONIBLES = [
  { id: 'cabeceras', nombre: '🏷️ Cabeceras HTML' },
  { id: 'cupones', nombre: '🎫 Cupones HTML' },
  { id: 'inpage', nombre: '📄 Inpage HTML' },
  { id: 'puntos', nombre: '📍 Puntos de Retiro' }
]

function App() {
  const [seccionActiva, setSeccionActiva] = useState('cupones')

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 h-100">

        {/* Menú Lateral Semántico */}
        <aside className="col-md-3 bg-dark text-white p-4">
          <h4 className="mb-4">📋 Secciones Hites</h4>
          <nav className="d-grid gap-2">
            {SECCIONES_DISPONIBLES.map((seccion) => (
              <button
                key={seccion.id}
                className={`btn text-start ${seccionActiva === seccion.id ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setSeccionActiva(seccion.id)}
              >
                {seccion.nombre}
              </button>
            ))}
          </nav>
        </aside>

        {/* Área de Trabajo Semántica */}
        <main className="col-md-9 p-5 bg-light" style={{ overflowY: 'auto' }}>
          <h1 className="display-5 mb-2">
            {seccionActiva === 'cabeceras' ? '  Cabeceras HTML' :
              seccionActiva === 'cupones' ? '  Cupones HTML' :
              seccionActiva === 'inpage' ? '📄 Inpage HTML' : '📍 Puntos de Retiro'}
          </h1>
          <p className="text-muted mb-4">Herramienta de automatización modular.</p>

          {/* Renderizado Condicional */}
          {seccionActiva === 'cabeceras' && <Cabeceras />}
          {seccionActiva === 'cupones' && <Cupones />}
          {seccionActiva === 'inpage' && <Inpage />}
          {seccionActiva === 'puntos' && <PuntosRetiro />}
        </main>

      </div>
    </div>
  )
}

export default App