import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { IntroduccionComponent } from '../app/components/introduccion/introduccion.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { RankingComponent } from './ranking/ranking.component';



@NgModule({
  declarations: [IntroduccionComponent, PreguntasComponent, RankingComponent],
  imports: [
    CommonModule,
  ]
})
export class ComponentsModule { }
  
  