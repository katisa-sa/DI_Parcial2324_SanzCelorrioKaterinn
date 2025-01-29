import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GestionStorageService } from 'src/app/services/gestion-storage.service';
//Añadir los imports necesarios

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss'],
})
export class PreguntasComponent  {

  /*Podéis hacer uso de estas variables de referencia, modificarlas o incluso crear más si véis necesario*/

  //Guardar la lista de todas las preguntas. Preguntas[] dependerá de lo que se haya puesto en la interface
  listaPreguntas: Preguntas[] = [];
  //Guardará todas las respuestas que se han elegido
  respuestasSeleccionadas: string[] = [];
  //Guardará las respuestas con el orden aleatorio
  respuestasAleatorias: string[] = [];
  //Gestionará el disabled de los botones dependiendo de si esa pregunta ha sido respondida o no.
  deshabilitarBotones: boolean = false;
  //Guardará el index de la pregunta, para saber que esa pregunta ha sido respondida
  botonSeleccionadoPreguntaIndex: number[] = [];
  //Gestionará el visualizado del botón Volver a Jugar.
  mostrarBotonesAdicionales: boolean = false;
  respuestasErroneas: string[] = [];
  pregunta: string = "";
  respuestaCorrecta: string = "";
  respuestas: string[] = [];
  respuestasCorrectas: string[] = [];
  contRespuestasCorrectas: number = 0;
  resultadosGuardados: boolean = false;


  constructor(public leerArchivo: HttpClient, private gestionAlmacen: GestionStorageService, private alerta: AlertController) {}
  

  private cargarPreguntas() {
    //Llamamos al API mediante un observable
    let respPreguntas: Observable<Preguntas[]> = this.leerArchivo.get<Preguntas[]>("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple");
    //Suscripción al observable
    respPreguntas.subscribe(datos=>{
      this.listaPreguntas.push(...datos);
    
      //Recorremos la lista de preguntas
      for(let i=0; i<this.listaPreguntas.length; i++){
        this.pregunta = this.listaPreguntas[i].question;
        this.respuestasErroneas = this.listaPreguntas[i].incorrect_answers;
              
         /* Mezclamos el orden del array:
         * Creamos un array con los 3 valores que vienen en "incorrect_answer" + la "correct_answer".
         * Si vemos la interface, podemos observar que --> correct_answer: string; incorrect_answers: string[];
        */
         const respuestasAleatorias = this.mezclarOrdenArray([...this.respuestasErroneas, this.respuestaCorrecta]);
         /* Modificamos la interface para que pueda guardar un string[] de las respuestas ordenadas aleatoriamente.
          * Con los valores que vienen en la API, rellenamos pregunta y a ello le añadimos respuestasAleatorias, para que 
          * todos los valores de la interface estén rellenas.
          */
         this.respuestas = this.respuestasAleatorias;
        }
        //return { this.pregunta, this.respuestasAleatorias };
    })
  }

  //Este método se utiliza para mezclar el orden del array
  mezclarOrdenArray(array: any[]): any[] {

    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
      /* Generamos un número aleatorio entre [0, 1) -> 0(inclusivo) y 1(exclusivo)
       * Redondeamos hacia abajo con .floor para obtener un número entero
       * Obtiene un índice aleatorio entre 0 y currentIndex - 1 (Si tenemos un currentIndex de 5, anañizará los index 0,1,2,3 y 4)
       */
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Sustituye los valores de los respectivos index
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  /* Gestionará el click del botón
   * Tendrá que recibir los parámetros necesarios para cargar los array botonSeleccionadoPreguntaIndex y respuestasSeleccionadas
   */
  seleccionarRespuesta( respuestaSeleccionada: string, indice: number) {
    const respuestaCorrecta = this.listaPreguntas[indice].correct_answer;
    if(this.botonSeleccionadoPreguntaIndex.includes(indice)){
      this.botonSeleccionadoPreguntaIndex.push(indice);
    }
    if(respuestaCorrecta === respuestaSeleccionada){
      this.respuestasSeleccionadas[indice] = "correcto";
    } else {
      this.respuestasSeleccionadas[indice] = "incorrecto";
    }
    this.respuestasCorrectas.push(respuestaCorrecta);

    this.deshabilitarBotones = true;

    this.botonSeleccionadoPreguntaIndex.push(indice);
  }

  // Método que gestiona la lógica para guardar resultados cuando se pulse dicho botón
  guardarResultados() {
    for(let i=0; i<this.respuestasSeleccionadas.length;i++){
    if(this.respuestasSeleccionadas[i] === 'correto'){
      this.contRespuestasCorrectas++;
      this.respuestasCorrectas.push(this.respuestasSeleccionadas[i])
    }
    }
    this.gestionAlmacen.setString("respuestasSeleccionadas",JSON.stringify(this.respuestasSeleccionadas));
    this.gestionAlmacen.setString("respuestasCorrectas", JSON.stringify(this.respuestasCorrectas));
    this.gestionAlmacen.setString("contRespuestasCorrectas", JSON.stringify(this.contRespuestasCorrectas));

  }

  /* Una vez respondido todas las preguntas y al pulsar Guardar Resultados, 
   * Se realizará al conteo de aciertos y a guardar los valores en el Storage:
   * "respuestasSeleccionadas" --> Guardará las respuestas que se han seleccionado
   * "respuestasCorrectas" --> Guardará las respuestas correctas de cada pregunta, para luego comparar con las seleccionadas
   * "contRespuestasCorrectas" --> Guardará la cantidad de las respuestas correctas
   */
  comprobarRespuestasCorrectas():boolean {
      return this.respuestasSeleccionadas.length === this.listaPreguntas.length;
  }

  // Se podrá hacer uso de este método para resetear los valores, cuando se quiera jugar una partida nueva
  resetearValores(){
    this.listaPreguntas = [];
    this.respuestasSeleccionadas = [];
    this.respuestasAleatorias = [];
    this.deshabilitarBotones = false;
    this.botonSeleccionadoPreguntaIndex = [];
    this.mostrarBotonesAdicionales = false;
    this.respuestasErroneas = [];
    this.pregunta = "";
    this.respuestaCorrecta = "";
    this.respuestas = [];
    }

  // Gestión del alert para volver a jugar una partida.
  async volverAJugar() {
    this.resetearValores();
  }

  //El botón "Volver a Jugar" estará disabled por defecto, este método gestionará el disabled(true/false) del botón
  comprobarVolverAJugar(): boolean {
      return this.comprobarGuardarResultados()===true;  
  }
  //El botón "Guardar Resultados" estará disabled por defecto, este método gestionará el disabled(true/false) del botón
  comprobarGuardarResultados():boolean {
    return this.respuestasSeleccionadas.length === this.listaPreguntas.length;
  }

  async alertaBoton() {
    const alert = await this.alerta.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Volver a jugar',
          role: 'confirm',
          handler: () => {
            this.volverAJugar();
          },
        },
      ],
    });
  
    await alert.present();
  }
}
