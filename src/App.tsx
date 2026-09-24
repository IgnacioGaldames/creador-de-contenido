// src/App.tsx
import Cupones from './sections/cupones/Cupones'

function App() {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0 h-100">
        <main className="col-12 p-5 bg-light" style={{ overflowY: 'auto' }}>
          <h1 className="display-5 mb-2">🎫 Cupones HTML</h1>
          <p className="text-muted mb-4">Generador de cupones para el CMS de Hites.</p>
          <Cupones />
        </main>
      </div>
    </div>
  )
}

export default App