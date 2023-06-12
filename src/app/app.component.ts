import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CalculadoraSimulacion';

  viewInterface: number = 0;

  ngOnInit(): void {

  }

  changeView(event: any){
    if(event == 1){
      this.viewInterface = 1;
    }else if(event == 2){
      this.viewInterface = 2;
    }else{
      this.viewInterface = 0;
    }
  }


}
