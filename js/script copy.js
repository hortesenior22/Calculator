// SCREENS
const $screenOperation = document.getElementById("screen-operation"),
  $screenResult = document.getElementById("screen-result"),
  $btnNumber = document.querySelectorAll(".btn-number"),
  $btnOperation = document.querySelectorAll(".btn-operation"),
  $btnSigned = document.getElementById("btn-signed"),
  $btnEqual = document.getElementById("btn-result"),
  // exp = /[+\-x/%]$/;
  exp = /[+\-x\÷]$/;
let signed1,signed2,
  numbers = [undefined, undefined, undefined], //Array para guardar los numeros que se vayan introduciendo para luego calcular
  variableApoyo = false,
  resultado,
  hasError = false; // Inicialmente sin error


  function esOTerminaConOperador(elemento) {
  return exp.test(String(elemento).trim());
}

function negarNumero(){
  if(numbers[1] == undefined){
      numbers[0] = $screenResult.textContent;
      } else{
      numbers[2] = $screenResult.textContent;
  }
}

function truncateNumber(number, maxDigits) {
    let str = number.toString();
    if (str.length > maxDigits) {
        // Si tiene punto decimal, prioriza mantenerlo
        if (str.includes('.')) {
            str = str.substring(0, maxDigits + 1); // +1 por el punto
        } else {
            str = str.substring(0, maxDigits);
        }
    }
    return parseFloat(str);
}

let numCalculoIndefinido =[undefined, undefined, undefined];//En caso de tener por ej: "1+1" y se pulsa indefinidamente el "=", va aumentando en 1 el resultado

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
//Funciones que se ejecutan al pulsar el botón correspondiente
function numero(numero){
  if( $screenResult.textContent == "0" || variableApoyo == true){//Si se interactua por 1º vez o se ha introducido un operador se limpia la pantalla
      $screenResult.textContent="";//Clean screen
      hasError = false;
      variableApoyo = false;//Solo me sirve una vez, si queda en true no se concatenan los numeros de screenResult
      numbers[2] = "";//Lo limpio ya que más abajo empiezo a cuardar números y si no se van concatenando a "undefined"
    }

    if(esOTerminaConOperador($screenOperation) &&  $screenResult.textContent.trim() == ""){
      $screenResult.textContent="";
    }

    if(numbers[1] != undefined){//Solo inserta el primer número despúes de 
      numbers[2] = $screenResult.textContent.trim().concat(numero);
    }

    if($screenOperation.textContent.trim().substring($screenOperation.textContent.length-1) == "="){
      $screenOperation.textContent = "";
      $screenResult.textContent = "";
    }

    $screenResult.textContent += numero;
    numero=0;
}

function signoOperacion(signo){
  if(esOTerminaConOperador(signo) && numbers[2] != ""){
    resolverOperacion()
  }
  $screenOperation.textContent = $screenResult.textContent.concat(signo);//
  variableApoyo=true;
  //La siguiente línea sirve para que en caso de que sea un número que esté negado pues no reemplace el "-" que va delante de los numeros
  // let quitarOperador = $screenOperation.textContent.trim().substring(1, $screenOperation.textContent.trim().length).replace(/[+\-x\÷]/,"");
  numbers[0] = $screenResult.textContent.trim();
  
  console.log("Muestro numero numbers", numbers[0]);
  numbers[1] = signo;
}

function signoPorcentaje(signoP){
  if(signoP == "%" && numbers[0] != undefined){
    return numbers[0] / 100;
  }
    $screenOperation.textContent = $screenResult.textContent.concat(signoP);

    numbers[0] = $screenResult.textContent.trim();

    console.log("Muestro numero numbers", numbers[0]);
    numbers[1] = signoP;
    resolverOperacion();
}


//Funcion para resolver la Operación introducida
function resolverOperacion(){
 if(numbers[2] == "" || numbers[2] == undefined && numbers[1] != "%"){
      numbers[2] = numbers[0];
    }
   

    if(String(numbers[0]).includes(",") || String(numbers[2]).includes(",")){ //Reemplazo las comas por puntos ya que el punto es para los decimales
      numbers[0] = String(numbers[0]).replace(",", ".");
      numbers[2] = String(numbers[2]).replace(",", ".");
    }

    if(numbers[1] == "+"){
      resultado = Number(numbers[0]) + Number(numbers[2]);
    }else if(numbers[1] == "-"){
      resultado = Number(numbers[0]) - Number(numbers[2]);
    } else if(numbers[1] == "x"){
      resultado = Number(numbers[0]) * Number(numbers[2]);
    } else if(numbers[1] == "%"){
      resultado = Number(numbers[0]) / 100;
    } else if(numbers[1] == "÷"){
      if(numbers[0] == 0 && numbers[2] == 0){// 0 entre 0 es infinito 
        resultado = "Resultado Indefinido";
      } else{
        resultado = Number(numbers[0]) / Number(numbers[2]);
      }
    }
    if(numbers[1] == undefined){
      $screenOperation.textContent = $screenResult.textContent.replace(".", ",").concat("=");
      $screenResult.textContent = $screenResult.textContent.replaceAll(".", ",");
    } else{
      if(resultado == "Resultado Indefinido"){
        $screenResult.style.fontSize= "2.12rem";
        $screenResult.style.fontWeight= "bold";
        hasError = true; // Activa el flag de error
        // Habilito los botones deshabilitados cuando da "Resultado Indefinido"
        $btnOperation.forEach(el =>{
          el.disabled = true;
        })
        $btnSigned.disabled = true;
        $btnEqual.disabled = true;

      } else if (String(resultado).length > 9) {
              resultado = String(resultado).slice(0, 10);
              // resultado = truncateNumber(resultado, 9); // NO BORRAR HASTA PROBAR NUMERO DECIMALES
      }

        numCalculoIndefinido[0]= resultado;
        numCalculoIndefinido[1]= numbers[1];
        numCalculoIndefinido[2]= numbers[2];
        
        if(numbers[1] != undefined && numbers[2] != ""){
          $screenOperation.textContent = String(numbers[0]).concat(numbers[1], numbers[2], "=").replaceAll(".", ",");
          $screenResult.textContent = String(resultado).replaceAll(".", ",");
          numbers[0] = resultado;
          numbers[1] = undefined;
          numbers[2] = undefined;
          resultado = undefined;
        } else if(numbers[1] != undefined && numbers[2] == ""){
          $screenOperation.textContent = String(numbers[0]).concat(numbers[1], "=").replaceAll(".", ",");
          $screenResult.textContent = String(resultado).replaceAll(".", ",");
          numbers[0] = resultado;
          numbers[1] = undefined;
          resultado = undefined;
        }
    }
  }

let $botonPulsado;
document.addEventListener("click", (e) => {

let $botonPulsado = document.getElementById(e.target.id).textContent.trim();//Le asignamos en cada boton pulsado su valor
  console.log($botonPulsado);

  if(/C/.test($botonPulsado) || (resultado != undefined && !esOTerminaConOperador($botonPulsado))){
     $screenOperation.innerHTML = '<br>';
     $screenResult.textContent = "0";
     numbers[0] = undefined;
     numbers[1] = undefined;
     numbers[2] = undefined;
     resultado = undefined;
     hasError = false;
     if(/C/.test($botonPulsado)) {
      console.clear();
     }
     
  }

  if(/[0-9]/.test($botonPulsado)){
    numero($botonPulsado);
    hasError=false;
  } 
// Si da error solo se puede limpiar la pantalla o puslar un número para reiniciar a una nueva operacion
if(!hasError){ 
  if(esOTerminaConOperador($botonPulsado) && $botonPulsado != "+/-"){
  //Si el screenOperation(superior) acaba en operador y queremos cambiar el signo, pero ES diferente al signo "+/-", porque también acaba en operador, y pa que no lo imprima tal cual
    signoOperacion($botonPulsado);
      
  }
  if($botonPulsado == "%"){
    signoPorcentaje($botonPulsado);
  }

    if($botonPulsado == "+/-" && $screenResult.textContent.trim().substring(0,1) != "-" && $screenResult.textContent != "0"){
          $screenResult.textContent = "-".concat($screenResult.textContent);
          negarNumero();
    } else if($botonPulsado == "+/-" && $screenResult.textContent.trim().substring(0,1) == "-"){
          $screenResult.textContent = $screenResult.textContent.replace("-","");
          negarNumero();
    }
    if($botonPulsado == ","){
      if($screenResult.textContent.trim() == 0){
         $screenResult.textContent = $screenResult.textContent.concat(",");
      } else if($screenOperation.textContent.trim() == "" &&  !$screenResult.textContent.includes(",")){
        $screenResult.textContent = $screenResult.textContent.trim().concat(",");
      } else if(esOTerminaConOperador(numbers[1]) &&  !$screenResult.textContent.includes(",")){
         $screenResult.textContent = $screenResult.textContent.trim().concat(",");
        //  numbers[2] += $botonPulsado;
      }
    }

   if(/=/.test($botonPulsado)){
      if(/=/.test($screenOperation.textContent.trim())){
        numbers[0] = numCalculoIndefinido[0];
        numbers[1] = numCalculoIndefinido[1];
        numbers[2] = numCalculoIndefinido[2];
      }
    resolverOperacion();
   }
}
  
if($screenResult.textContent != "Resultado Indefinido"){
    $screenResult.style.fontSize= "4rem"; //La pantalla se establece con 4rem
    $screenResult.style.fontWeight= "normal"; //La pantalla se establece con la fuente fina

    if($btnEqual.hasAttribute('disabled')){//Con que un botón esté disabled se da por hecho que los demás lo están
      // Habilito los botones deshabilitados cuando da "Resultado Indefinido"
      $btnOperation.forEach(el =>{
              el.disabled = false;
            })
      $btnSigned.disabled = false;
      $btnEqual.disabled = false;
    }
    
  }
  /***************************************************************************************************** */

  

    
 /* SE EJECUTA SI PULSA UN NUMERO */
//  if(e.target.get)
 /* SE EJECUTA SI PULSA UN SIGNO (+, -, x, ÷) */
 /* SE EJECUTA SI PULSA UN SIGNO ESPECIAL (C, =, +/-, % ) */
});
