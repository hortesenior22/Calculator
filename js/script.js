// SCREENS
const $screenOperation = document.getElementById("screen-operation"),
  $screenResult = document.getElementById("screen-result"),
  $btnNumber = document.querySelectorAll(".btn-number"),
  // exp = /[+\-x/%]$/;
  exp = /[+\-x\÷]$/;
  //exp = /(?:[+\-*/]|&plus;|&minus;|&times;|&divide;)$/;
let $signed,
  numbers = [undefined, undefined, undefined], //Array para guardar los numeros que se vayan introduciendo para luego calcular
  numero, //Se van guardando los valores de los botones de numero hasta que se pulse un boton diferente a un número
  variableApoyo = false,
  resultado;


  function terminaConOperador(elemento) {
  return exp.test(elemento.textContent.trim());
}

function guardarNumeros(valor) {
  //Sirve para ir guardando los numeros en un array, y como en la primera el valor de cada array es undefined se inicializa con el primer numero y luego vamos concatenando
  if (numbers[1] == undefined) {
    if (numbers[0] == undefined) {
      numbers[0] = valor;
    } else {
      numbers[0] += valor;
    }
  } else {
    if (numbers[2] == undefined) {
      numbers[2] = valor;
    } else {
      numbers[2] += valor;
    }
  }
}

document.addEventListener("click", (e) => {
  console.log(`Hola he sido pulsado por `, e.target);

  if (e.target.className.includes("btn-number")) {
    //Si la screenInferior es igual a 0 o la superior está vacía o acaba con un "="
    if(terminaConOperador($screenOperation) && /[0-9]/.test(e.target.textContent.trim()) && variableApoyo == false){
      $screenResult.textContent = "";
      variableApoyo=true;
    }
    if ($screenResult.textContent.trim() == 0 && $screenOperation.textContent.trim() == "") {
      $screenResult.textContent = e.target.textContent.trim(); //Reemplazo la pantalla inferior
    
    } else if ($screenOperation.textContent.endsWith("=")) {
      $screenOperation.textContent = ""; //Limpio la pantalla superior porque si hay un "=" puede que haya una operación
      $screenResult.textContent = e.target.textContent.trim();
      numbers[0] = "";
    
    } else if (terminaConOperador($screenOperation) && $screenResult.textContent.trim() == "" && variableApoyo==false) {
    //   // if(comprobarFinalCadena($screenOperation.textContent)){
    //   if(terminaConOperador($screenOperation)){
    //     $screenResult.textContent = "";
    //   }

    //   //En caso de que en la superior haya un signo de operacion[+-*/] se van concatenando en la pantalla inferior
    //   // $screenOperation.textContent = e.target.textContent.trim(); //Reemplazo la pantalla inferior
    //   $screenResult.textContent += e.target.textContent.trim(); //Reemplazo la pantalla inferior
    //   //En caso
     $screenResult.textContent = e.target.textContent.trim();
     console.log("C1",$screenOperation.textContent);

  } else {
      $screenResult.textContent += e.target.textContent.trim();
      console.log("C2",terminaConOperador($screenOperation));
    }

    //console.log("C3",$screenOperation.textContent);
    guardarNumeros(e.target.textContent.trim());
  }
  /*
    BOTONES OPERACIONES
*/
  if (e.target.className.includes("btn-operation")) {
    // if (exp.test(e.target.textContent)) {
      if (terminaConOperador(e.target)) {
      //Si se pulsa un signo es true
      console.log("Se ejecuta al pulsar un signo: ", e.target);
      // if (!exp.test($screenOperation.textContent.substring($screenOperation.textContent.length - 1))) {
      if (!terminaConOperador($screenOperation)) {
        console.log("Se ejecuta si el úlitmo digito NO es un signo: ",e.target);
        $screenOperation.textContent = $screenResult.textContent.concat(e.target.textContent.trim());
        numbers[1] = e.target.textContent.trim();
      } else {
        console.log("Comprobar: ",!terminaConOperador($screenOperation));
        //Reemplazo el signo que había por el nuevo que ha sido pulsado
        $screenOperation.textContent = $screenResult.textContent.concat(
          e.target.textContent.trim()
        );
        numbers[1] = e.target.textContent.trim();
      }
    }
  }
  /*
    BOTONES ESPECIALES
*/

  if (e.target.className.includes("btn-special")) {
    if (e.target.textContent.trim() == "C") {
      numbers.length = 0;
      numero = "";
      $screenResult.textContent = 0;
      $screenOperation.textContent = "";
    } else if (e.target.textContent.trim() == "+/-") {
      $signed = document.getElementById("btn-signed");
      if ($screenResult.textContent != 0) {
        if ($signed.dataSigno != "true") {
          $screenResult.textContent = "-".concat($screenResult.textContent);
          $signed.dataSigno = "true";
        } else {
          $screenResult.textContent = $screenResult.textContent.replace(
            "-",
            ""
          );
          $signed.dataSigno = "";
        }
      }
    } else if (e.target.textContent.trim() == "=") {
      if ($screenOperation.textContent.trim().substring($screenOperation.textContent.length - 1) != "=") {
         if (numbers[1] == undefined) {
          $screenResult.textContent = $screenResult.textContent;
          console.log("Se imprime si no hay simbolo");
        }else if (numbers[2] == undefined) {
          $screenOperation.textContent += numbers[0];
          numbers[2] = numbers[0];
        }
        $screenOperation.textContent += "=";
          if (numbers[0] == undefined) {
            numbers[0] = 0;
          }
          switch (numbers[1]) {
            case "+":
              resultado = Number(numbers[0])+ Number(numbers[2]);
              break;
            case "-":
              resultado = Number(numbers[0])- Number(numbers[2]);
              break;
            case "x":
              resultado = Number(numbers[0])* Number(numbers[2]);
              break;
            case "÷":
              resultado = Number(numbers[0])/ Number(numbers[2]);
              break;
            default:
              resultado = $screenResult.textContent.trim();
              $screenOperation.textContent = resultado.concat("=");
              break;
          }
        String(resultado).length;
        console.log("ultima fila 1: ", $screenResult.textContent);
        if (String(resultado).length > 9) {
          resultado = String(resultado).slice(0, 10);
        }
        // else if (resultado == undefined) {
        //   resultado = $screenResult.textContent;
        //   $screenOperation.textContent = $screenResult.textContent.concat("=");
        // }
        console.log("RESUL: ", resultado);
        console.log("ultima fila 2: ", $screenResult.textContent.trim());
        $screenResult.textContent = Number(resultado);
        console.log("ultima fila 3: ", $screenResult.textContent);
        numbers[0] = resultado;
        numbers[1] = undefined;
        numbers[2] = undefined;
      }
    }
  }
});
