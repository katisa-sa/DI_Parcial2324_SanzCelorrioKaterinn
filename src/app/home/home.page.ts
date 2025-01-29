import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Declaramos las variables necesarias
  selectedButton: String = "introduccion";
  titulo:String ="Trivial";
  descripcion: String ="Bienvenido al trivial app";
  url: String = ".\src\assets\icon\trivia.jpg";

  constructor() {}

  //inicializamos el segmento con su valor inicial

  //Gestionamos el cambio de segmentos
  onSegmentChange(event: any){
    this.selectedButton = event.detail.value;
  }

}
