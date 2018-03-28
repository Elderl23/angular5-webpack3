// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';


import { MenuModule} from '../menu/menu.module';

import { AuthGuard} from '../classGeneric/config';

// Importaciones routing app
import { DashRoutingModule }     from './dash-routing.module';

// Component
import { DashboardComponent } from './dash.component';


@NgModule({
  imports: [
    MenuModule,
    CommonModule,
    FormsModule,
    DashRoutingModule,
  ],
  declarations: [//Componentes
    DashboardComponent,
  ],
  providers: [
    AuthGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class DashboardModule { }
