import React, { useRef } from 'react'

interface Props {
  esContador: boolean
  setEsContador: (valor: boolean) => void
  fechaContador: string
  setFechaContador: (valor: string) => void
}

export default function SelectorContador({
  esContador,
  setEsContador,
  fechaContador,
  setFechaContador
}: Props) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Extraemos la fecha y hora del estado (que viene con formato YYYY-MM-DDTHH:mm)
  const [fecha = '', hora = '23:59'] = fechaContador.includes('T') 
    ? fechaContador.split('T') 
    : [fechaContador, '23:59'];

  const manejarCambioFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaContador(`${e.target.value}T${hora}`);
  };

  const manejarCambioHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaContador(`${fecha}T${e.target.value}`);
  };

  const abrirCalendario = () => {
    try {
      dateInputRef.current?.showPicker();
    } catch (error) {
      // Fallback si el navegador no soporta showPicker
    }
  };

  const abrirReloj = () => {
    try {
      timeInputRef.current?.showPicker();
    } catch (error) {
      // Fallback si el navegador no soporta showPicker
    }
  };

  return (
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
          <label className="form-label fw-bold">
            📅 Fecha y hora de término del contador:
          </label>
          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <div className="input-group" onClick={abrirCalendario}>
                <span className="input-group-text cursor-pointer" title="Fecha" style={{ cursor: 'pointer' }}>📅</span>
                <input
                  ref={dateInputRef}
                  type="date"
                  className="form-control"
                  style={{ cursor: 'pointer' }}
                  value={fecha}
                  onChange={manejarCambioFecha}
                  onClick={abrirCalendario}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="input-group" onClick={abrirReloj}>
                <span className="input-group-text cursor-pointer" title="Hora" style={{ cursor: 'pointer' }}>⏰</span>
                <input
                  ref={timeInputRef}
                  type="time"
                  className="form-control"
                  style={{ cursor: 'pointer' }}
                  value={hora}
                  onChange={manejarCambioHora}
                  onClick={abrirReloj}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
