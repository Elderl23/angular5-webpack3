// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MenuModule} from '../menu/menu.module';

// Validator
import { ValidationModule } from '../validator/validation.module';
import { ValidationService } from '../validator/validation.service';


// Importaciones routing app
import { routes } from './login-routing.module';

// Component
import { LoginComponent } from './login.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    MenuModule,
    ValidationModule,
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    ValidationService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class LoginModule {
  static routes = routes;
}
