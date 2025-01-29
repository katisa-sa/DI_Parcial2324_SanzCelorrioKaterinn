import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { IntroduccionComponent } from './introduccion/introduccion.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { RankingComponent } from './ranking/ranking.component';
import { GestionStorageService } from '../services/gestion-storage.service';



@NgModule({
  declarations: [IntroduccionComponent, PreguntasComponent, RankingComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    RankingComponent, PreguntasComponent, IntroduccionComponent
  ]
})
export class ComponentsModule { }
  
  