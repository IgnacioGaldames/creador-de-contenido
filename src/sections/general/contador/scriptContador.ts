// src/sections/general/contador/scriptContador.ts
export const obtenerScriptContador = (sufijoSeccion: string, fechaLimite: string) => {
  return `<script>
  var contadorHites${sufijoSeccion} = document.getElementById("contadorHites${sufijoSeccion}");
  var contadorCompletoHites${sufijoSeccion} = document.getElementById("contadorDestacadocupones");
  var seccionSolox${sufijoSeccion} = document.getElementById("solox${sufijoSeccion}");

  var countDownDate = new Date("${fechaLimite}").getTime();

  function actualizarContador${sufijoSeccion}() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    if (distance < 0) {
      if (contadorHites${sufijoSeccion}) {
        contadorHites${sufijoSeccion}.classList.remove("d-flex");
        contadorHites${sufijoSeccion}.classList.add("d-none");
        contadorHites${sufijoSeccion}.style.setProperty("display", "none", "important");
      }
      if (contadorCompletoHites${sufijoSeccion}) {
        contadorCompletoHites${sufijoSeccion}.classList.remove("d-flex");
        contadorCompletoHites${sufijoSeccion}.classList.add("d-none");
        contadorCompletoHites${sufijoSeccion}.style.setProperty("display", "none", "important");
      }
      if (seccionSolox${sufijoSeccion}) {
        seccionSolox${sufijoSeccion}.classList.remove("d-block", "d-flex");
        seccionSolox${sufijoSeccion}.classList.add("d-none");
        seccionSolox${sufijoSeccion}.style.setProperty("display", "none", "important");
      }
      return true;
    }

    var totalHours${sufijoSeccion} = Math.floor(distance / (1000 * 60 * 60));
    var minutes${sufijoSeccion} = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds${sufijoSeccion} = Math.floor((distance % (1000 * 60)) / 1000);

    totalHours${sufijoSeccion} = totalHours${sufijoSeccion} < 10 ? '0' + totalHours${sufijoSeccion} : totalHours${sufijoSeccion};
    minutes${sufijoSeccion} = minutes${sufijoSeccion} < 10 ? '0' + minutes${sufijoSeccion} : minutes${sufijoSeccion};
    seconds${sufijoSeccion} = seconds${sufijoSeccion} < 10 ? '0' + seconds${sufijoSeccion} : seconds${sufijoSeccion};

    var contadorHoras${sufijoSeccion} = document.getElementById("contadorHoras${sufijoSeccion}");
    var contadorMinutos${sufijoSeccion} = document.getElementById("contadorMinutos${sufijoSeccion}");
    var contadorSegundos${sufijoSeccion} = document.getElementById("contadorSegundos${sufijoSeccion}");

    if (contadorHoras${sufijoSeccion}) contadorHoras${sufijoSeccion}.innerHTML = totalHours${sufijoSeccion};
    if (contadorMinutos${sufijoSeccion}) contadorMinutos${sufijoSeccion}.innerHTML = minutes${sufijoSeccion};
    if (contadorSegundos${sufijoSeccion}) contadorSegundos${sufijoSeccion}.innerHTML = seconds${sufijoSeccion};

    return false;
  }

  var expirado${sufijoSeccion} = actualizarContador${sufijoSeccion}();

  if (!expirado${sufijoSeccion}) {
    var x${sufijoSeccion} = setInterval(function () {
      var terminado = actualizarContador${sufijoSeccion}();
      if (terminado) {
        clearInterval(x${sufijoSeccion});
      }
    }, 1000);
  }
</script>`;
};