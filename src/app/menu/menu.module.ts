// Importaciones generales
import { NgModule}      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


import { MenuComponent} from '../menu/menu.component';
import { MenuLogoutComponent } from './logoutmenu.component';

import { LogoutRoutingModule } from './logoutmenu-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    LogoutRoutingModule,
  ],
  declarations: [
    MenuComponent,
    MenuLogoutComponent
  ],
  exports: [MenuComponent]
})



export class MenuModule { }
