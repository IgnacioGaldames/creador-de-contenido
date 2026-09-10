// Ruta: src/hooks/useProcesarYCopiar.ts

import { useState } from 'react';

export function useProcesarYCopiar() {
  const [copiado, setCopiado] = useState(false);
  const [generado, setGenerado] = useState(false);

  // Esta función ahora recibe el HTML ya generado como ingrediente (parámetro)
  const ejecutarCopia = async (htmlNuevo: string) => {
    if (!htmlNuevo) return;

    try {
      await navigator.clipboard.writeText(htmlNuevo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar el código: ', err);
    }

    setGenerado(true);
    setTimeout(() => setGenerado(false), 2000);
  };

  // El archivo nos "presta" estas tres cosas para usarlas en nuestras secciones
  return { ejecutarCopia, copiado, generado };
}