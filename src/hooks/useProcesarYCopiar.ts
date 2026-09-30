// Ruta: src/hooks/useProcesarYCopiar.ts

import { useCallback, useState } from 'react';

export function useProcesarYCopiar() {
  const [copiado, setCopiado] = useState(false);
  const [generado, setGenerado] = useState(false);
  const [errorCopia, setErrorCopia] = useState(false);

  // Esta función ahora recibe el HTML ya generado como ingrediente (parámetro)
  const ejecutarCopia = useCallback(async (htmlNuevo: string) => {
    if (!htmlNuevo) return;

    setCopiado(false);
    setGenerado(false);
    setErrorCopia(false);

    try {
      await navigator.clipboard.writeText(htmlNuevo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar el código: ', err);
      setErrorCopia(true);
      return;
    }

    setGenerado(true);
    setTimeout(() => setGenerado(false), 2000);
  }, []);

  // El archivo nos "presta" estas tres cosas para usarlas en nuestras secciones
  return { ejecutarCopia, copiado, generado, errorCopia };
}