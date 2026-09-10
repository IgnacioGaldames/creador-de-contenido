// src/components/BotonGenerarCopiar.tsx

interface BotonProps {
  alHacerClic: () => void;
  generado: boolean;
  copiado: boolean;
}

export default function BotonGenerarCopiar({ alHacerClic, generado, copiado }: BotonProps) {
  const estaActivo = generado || copiado;

  return (
    <button
      className={`btn w-100 mb-3 fw-bold ${estaActivo ? 'btn-success' : 'btn-primary'}`}
      onClick={alHacerClic}
    >
      {estaActivo ? '✅ ¡Código Generado y Copiado!' : '⚡ Generar y Copiar HTML'}
    </button>
  );
}