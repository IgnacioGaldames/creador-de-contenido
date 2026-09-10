
export const obtenerPlantillaContador = (
  esContador: boolean,
  sufijoSeccion: string
) => {

  const contenidoContador = `<div
  class="articulat text-light fw-bolder fs-4 fs-md-4 fs-lg-1 position-absolute z-1 top-70 top-md-33 left-59 left-md-77 left-lg-78"
id = "contadorCompletoHites${sufijoSeccion}" >
  <p>
  <!-- <span class="" id = "contadorDias${sufijoSeccion}" > </span>
    <span class="text-pink" >: </span> -->
      <span class="" id = "contadorHoras${sufijoSeccion}" > </span>
        <span class="text-pink" >: </spa|n>
          <span class="" id = "contadorMinutos${sufijoSeccion}" > </span>
            <span class=" text-pink" >: </span>
              <span class="" id = "contadorSegundos${sufijoSeccion}" > </span>
                </p>
                </div>`;
  if (esContador) {
    return `\n<div class="slide-mundo destacadoHome px-2">\n${contenidoContador}\n</div>\n`;
  } else {
    return ``;
  }
};