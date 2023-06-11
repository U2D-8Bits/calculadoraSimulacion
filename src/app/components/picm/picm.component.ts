import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-picm',
  templateUrl: './picm.component.html',
  styleUrls: ['./picm.component.css']
})
export class PicmComponent {
  panelOpenState = false;
  //Creamos una variable de Formulario
  myForm!: FormGroup;

  costForm!: FormGroup;


  // Variables para mostrar Costos
  ctValue: number = 0;
  ctseValue: number = 0;
  ctsValue: number = 0;
  csValue: number = 0;
  cteValue: number = 0;


  //Varaibles de Probabilidad

  P0: number = 0;
  Pk: number = 0;
  Pne: number = 0;
  Pn: number = 0;


  //Variables de numero esperado de clientes
  L: number = 0;
  Lq: number = 0;
  Ln: number = 0;


  //Variables de tiempo esperado de clientes
  W: number = 0;
  Wq: number = 0;
  Wn: number = 0;


  constructor(
    public formService: FormBuilder
  ) {
    //Creamos el formulario
    this.myForm = this.formService.group({
      lambda: [
        null,
        //Establecemos el rango de numero positivos
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      miu: [
        null,
        //Establecemos el rango de numero positivos
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      k: [
        null,
        //Establecemos el rango de numero positivos
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      n:[
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ]
    });

    this.costForm = this.formService.group({
      h: [
        null,
        [ Validators.required,
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      Cte:[
        null,
        [
          Validators.required,
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      Cts:[
        null,
        [ Validators.required,
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      Ctse:[
        null,
        [ Validators.required,
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
      Cs:[
        null,
        [ Validators.required,
          Validators.pattern('^([1-9][0-9]*|0)(\.[0-9]+)?$')
        ]
      ],
    });

  }

  ngOnInit(): void {

  }

  calculate(){
    console.log("Calculando...");
    console.log("Contenido del Formulario =>",this.myForm.value);
    this.getP0();
    this.getPk();
    this.getPne();
    this.getPn();
    this.getL();
    this.getLq();
    this.getLn();
    this.getW();
    this.getWq();
    this.getWn();
  }




  //Funciones para calcular cada probabilidad

  getP0(){

    let k = this.myForm.value.k;
    let lambda = this.myForm.value.lambda;
    let miu = this.myForm.value.miu;


    let n = k - 1;
    let total = 0;
    let fraccionUno = 0;
    let fraccionDos = 0;
    let sumatoria = 0;
    let denominadorUno = 0;
    let denominadorDos = 0;


    for(let i = 0; i <= n; i++){
      fraccionUno = 1/this.getFactorial(i);
      fraccionDos = this.getExponencial(lambda, miu, i);
      sumatoria = fraccionUno * fraccionDos;
      total += sumatoria;
    }

    denominadorUno = total;

    //segunda parte de la formula

    fraccionUno = 1/this.getFactorial(k);
    fraccionDos = this.getExponencial(lambda, miu, k);
    denominadorDos = (fraccionUno * fraccionDos * (k * miu))/(k * miu - lambda);

    this.P0 = 1/(denominadorUno + denominadorDos);

  }

  getPk(){

    let numerador = 0;
    let denominador = 0;
    let fraccionUno = 0;
    let fraccionDos = 0;


    let lambda = this.myForm.value.lambda;
    let miu = this.myForm.value.miu;
    let k = this.myForm.value.k;

    //Primera parte de la formula
    fraccionUno = 1 / this.getFactorial(k);
    fraccionDos = this.getExponencial(lambda,miu,k);
    fraccionDos = parseFloat(fraccionDos.toFixed(3));

    numerador = miu * k;
    denominador = (k * miu) - lambda;

    this.Pk = fraccionUno * fraccionDos * ((numerador * this.P0) / denominador)
  }

  getPne(){

    const resultado = 1 - this.Pk;
    this.Pne = resultado;

  }

  //Funcion para calcular PN
  getPn(){

    let n = this.myForm.value.n;
    let k = this.myForm.value.k;

    let lambda = this.myForm.value.lambda;
    let miu = this.myForm.value.miu;


    //Cuando n es menor que k
    if( n < k){
      let P0 = this.P0;
      P0 = parseFloat(P0.toFixed(3));
      const denominadorUno = this.getFactorial(n);
      const fracionUno = P0/denominadorUno;
      const fraccionDos = this.getExponencial(lambda, miu, n);
      const resultado = fracionUno * fraccionDos;

      this.Pn = resultado;
    }else{
      //Cuando n es mayor que k
      let P0 = this.P0;
      P0 = parseFloat(P0.toFixed(3));

      const factorialK = this.getFactorial(k);
      const exponecial = n - k;
      const exponenciacionK = this.getExponecialSinFraccion(k, exponecial);

      const fraccionUno = 1/(factorialK * exponenciacionK);

      const fraccionDos = this.getExponencial(lambda, miu, n);

      const resultado = P0 * fraccionUno * fraccionDos;

      this.Pn = resultado;
    }
  }


  //Funciones para calcular cada numero esperado de clientes

  getL(){

    const lambda = this.myForm.value.lambda;
    const miu = this.myForm.value.miu;
    const k = this.myForm.value.k;

    const numerador = (lambda * miu) * this.getExponencial(lambda, miu, k);
    const denominador = this.getFactorial(k-1) * this.getExponecialSinFraccion((k*miu)-lambda, 2);
    const resultado = this.P0*numerador/denominador + (lambda/miu);
    this.L = resultado;
  }

  getLq(){
    const lambda = this.myForm.value.lambda;
    const miu = this.myForm.value.miu;
    const k = this.myForm.value.k;

    const numerador = (lambda * miu) * this.getExponencial(lambda, miu, k);
    const denominador = this.getFactorial(k-1) * this.getExponecialSinFraccion((k*miu)-lambda, 2);

    const resultado = this.P0*numerador/denominador;

    this.Lq = resultado;

  }

  getLn(){
    this.Ln = this.Lq / this.Pk;
  }


  //Funciones para calcular cada tiempo esperado de clientes

  getW(){

    const lambda = this.myForm.value.lambda;
    const miu = this.myForm.value.miu;
    const k = this.myForm.value.k;

    const numerador = miu * this.getExponencial(lambda, miu, k) * this.P0;
    const denominador = this.getFactorial(k-1) * this.getExponecialSinFraccion((k*miu)-lambda, 2);

    const resultado = numerador/denominador + (1/miu);

    this.W = resultado;

  }

  getWq(){

    const lambda = this.myForm.value.lambda;
    const miu = this.myForm.value.miu;
    const k = this.myForm.value.k;

    const numerador = miu * this.getExponencial(lambda, miu, k) * this.P0;
    const denominador = this.getFactorial(k-1) * this.getExponecialSinFraccion((k*miu)-lambda, 2);

    const resultado = numerador/denominador;

    this.Wq = resultado;

  }

  getWn(){
    this.Wn = this.Wq / this.Pk;
  }

  //Funciones para calcular cada costo
  getCostoTE(){

    const lambda = this.myForm.value.lambda;
    const cte = this.costForm.value.Cte;
    const h = this.costForm.value.h;
    this.Wq = parseFloat(this.Wq.toFixed(3));

    //Console log de todos los valores
    console.log("Lambda: ", lambda);
    console.log("CTE: ", cte);
    console.log("H: ", h);
    console.log("Wq: ", this.Wq);

    const resultado = lambda * h * this.Wq * cte;
    this.cteValue = resultado;

    console.log("Costo TE: ", resultado)

  }

  getCostoTS(){

    //La formula aqui es lambda * h * Wq * cts
    const lambda = this.myForm.value.lambda;
    const cts = this.costForm.value.Cts;
    const h = this.costForm.value.h;
    this.Wq = parseFloat(this.Wq.toFixed(3));

    const resultado = lambda * h * this.Wq * cts;
    this.ctsValue = resultado;

    console.log("Costo TS: ", resultado)

  }

  getCostoTSE(){

    //La formula aqui es lambda * h * (1/miu) * ctse
    const lambda = this.myForm.value.lambda;
    const ctse = this.costForm.value.Ctse;
    const h = this.costForm.value.h;
    const miu = this.myForm.value.miu;

    const resultado = lambda * h * (1/miu) * ctse;
    this.ctseValue = resultado;

    console.log("Costo TSE: ", resultado)

  }

  getCostoS(){

    //La formula aqui es k * cs
    const k = this.myForm.value.k;
    const cs = this.costForm.value.Cs;

    const resultado = k * cs;
    this.csValue = resultado;

    console.log("Costo S: ", resultado)

  }

  calcularCT(){

    //imprimimos el valro del formulario
    console.log("Valor del formulario: ", this.costForm.value);


    this.getCostoTE();
    this.getCostoTS();
    this.getCostoTSE();
    this.getCostoS();

    const resultado = this.cteValue + this.ctsValue + this.ctseValue + this.csValue;
    this.ctValue = resultado;
    console.log("valor de resultado: ", this.ctValue);
  }


// ====================  Funciones complementarias ==================== //

getFactorial(a: number): number{
  if(a === 0){
    return 1;
  }else{
    return a * this.getFactorial(a-1);
  }
}

getExponencial(a:number, b:number, c:number): number{
  let numerador = a;
  let denominador = b;

  if(c === 0){
    return 1;
  }else{
    for(let i = 1; i < c ; i++){
      numerador *= a;
      denominador *= b;
    }
    return numerador/denominador;
  }
}


getExponecialSinFraccion(a: number,b:number): number{

  let resultado = a;

  if (b === 0) {
    return 1;
  }

  for (let i = 1; i < b; i++) {
    resultado *= a;
  }
  return resultado;

}


  ngOnDestroy(): void {

    this.myForm.reset();
  }
}
