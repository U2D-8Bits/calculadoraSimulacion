import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pfcm',
  templateUrl: './pfcm.component.html',
  styleUrls: ['./pfcm.component.css']
})
export class PfcmComponent {
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
  Pe: number = 0;


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
      ],
      m:[
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
    if(this.myForm.value.n > this.myForm.value.k){

      let lambda = this.myForm.value.lambda;
      let miu = this.myForm.value.miu;
      let n = this.myForm.value.n;
      let m = this.myForm.value.m;


      this.getPnUno(lambda,miu,n,m);
    }else{
      let lambda = this.myForm.value.lambda;
      let miu = this.myForm.value.miu;
      let n = this.myForm.value.n;
      let m = this.myForm.value.m;

      this.getPnDos(lambda, miu, n, m);
    }
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
    let m = this.myForm.value.m;

    let n = k - 1;
    let mFactorial = this.getFactorial(m);
    let fraccionUno = 0;
    let parteUno = 0;

    let totalUno = 0;

    let totalDos = 0;

    for(let i = 0; i <= n; i++){
      fraccionUno = mFactorial / (this.getFactorial(m - i) * this.getFactorial(i));

      parteUno = fraccionUno * this.getExponencial(lambda,miu,i);
      totalUno += parteUno;
    }

    for(let i = k; i <= m; i++){
      fraccionUno = mFactorial / (this.getFactorial(m - i) * this.getFactorial(k) * this.getExponecialSinFraccion(k, i-k));
      parteUno = fraccionUno * this.getExponencial(lambda,miu,i);
      totalDos += parteUno;
    }

    this.P0 = 1 / (totalUno + totalDos);

    //parseamos el valor de P0 a 3 decimales
    this.P0 = parseFloat(this.P0.toFixed(3));

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

    let pe = this.Pe;
    this.Pne = 1 - pe;
    //parseamos el valor de Pne a 3 decimales
    this.Pne = parseFloat(this.Pne.toFixed(3));

  }

  //Funcion para calcular PN cuando n es menor que k
  getPnUno(λ: number, μ: number, n: number, m: number){
          //Cuando n es menor que k
          let p0 = this.P0;

          let parteDos = this.getFactorial(m) / (this.getFactorial(m - n) * this.getFactorial(n));

          let pn = p0 * parteDos * this.getExponencial(λ,μ,n);

          this.Pn = pn;
          //parseamos el valor de Pn a 3 decimales
          this.Pn = parseFloat(this.Pn.toFixed(3));

          return pn;
  }

  //Calcular pn cunado n es mayor que k
  getPnDos(λ: number, μ: number, n: number, m: number){
    // let n = this.myForm.value.n;
    let k = this.myForm.value.k;
    // let lambda = this.myForm.value.lambda;
    // let miu = this.myForm.value.miu;
    // let m = this.myForm.value.m;



          //Cuando n es mayor que k
          let p0 = this.P0;
          let parteDos = this.getFactorial(m) / ((this.getFactorial(m - k) * this.getFactorial(k)) * this.getExponecialSinFraccion(k, n-k));

          let pn = p0 * parteDos * this.getExponencial(λ,μ,n);

          this.Pn = pn;

          //parseamos el valor de Pn a 3 decimales
          this.Pn = parseFloat(this.Pn.toFixed(3));

          return pn;
  }

getPE(){

  let lambda = this.myForm.value.lambda;
  let miu = this.myForm.value.miu;
  let k = this.myForm.value.k;
  let m = this.myForm.value.m;

  let sumatoria = 0;

  for(let i = 0; i <= (k-1); i++){
    if(i < k){
      sumatoria = sumatoria + this.getPnUno(lambda, miu, i, m);
    }else{
      sumatoria = sumatoria + this.getPnDos(lambda, miu, i, m);
    }
  }

  this.Pe = 1 - sumatoria;
  //parseamos el valor de Pe a 3 decimales
  this.Pe = parseFloat(this.Pe.toFixed(3));
}
  //Funciones para calcular cada numero esperado de clientes

  getL(){

    let sumatoriaUno = 0;
    let sumatoriaDos = 0;
    let sumatoriaTres = 0;
    let n = this.myForm.value.k - 1;
    let producto = 0;
    let totalDos = 0;

    for(let i = 0; i <= n; i++){
      producto = i * this.getPnUno(this.myForm.value.lambda, this.myForm.value.miu, i, this.myForm.value.m);

      sumatoriaUno += producto;
    }

    for(let i = 0; i <= n; i++){
      producto = (i - this.myForm.value.k) * this.getPnDos(this.myForm.value.lambda, this.myForm.value.miu, i, this.myForm.value.m);

      sumatoriaDos += producto;
    }

    for(let i = 0; i <= n; i++){
      sumatoriaTres += this.getPnUno(this.myForm.value.lambda, this.myForm.value.miu, i, this.myForm.value.m);
    }

    totalDos = sumatoriaUno + sumatoriaDos + this.myForm.value.k * sumatoriaTres * (1- sumatoriaTres);

    this.L = totalDos;

    //parseamos el valor de L a 3 decimales
    this.L = parseFloat(this.L.toFixed(3));

  }

  getLq(){

    let sumatoria = 0;
    let k = this.myForm.value.k;
    let m = this.myForm.value.m;

    for(let i = k; i <= m; i++){
      sumatoria += (i - k) * this.getPnDos(this.myForm.value.lambda, this.myForm.value.miu, i, this.myForm.value.m);
    }

    this.Lq = sumatoria;

    //parseamos el valor de Lq a 3 decimales
    this.Lq = parseFloat(this.Lq.toFixed(3));

  }

  getLn(){
    this.Ln = this.Lq / this.Pe;
  }


  //Funciones para calcular cada tiempo esperado de clientes

  getW(){

    let Wq = this.Wq;
    let miu = this.myForm.value.miu;

    this.W = Wq + (1 / miu);

    //parseamos el valor de W a 3 decimales
    this.W = parseFloat(this.W.toFixed(3));
  }

  getWq(){

    let m = this.myForm.value.m;
    let Lq = this.Lq;
    let L = this.L;
    let lambda = this.myForm.value.lambda;

    this.Wq = Lq / ((m - L) * lambda);

    //parseamos el valor de W a 3 decimales
    this.Wq = parseFloat(this.W.toFixed(3));


  }

  getWn(){

    let Wq = this.Wq;
    let Pe = this.Pe;

    this.Wn = Wq / Pe;

    //parseamos el valor de Wn a 3 decimales
    this.Wn = parseFloat(this.Wn.toFixed(3));
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
