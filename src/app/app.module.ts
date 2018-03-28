import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { environment } from 'environments/environment';

import { DashboardModule } from './dashboard/dash.module';
import { LoginModule } from './login/login.module';

import { MenuModule } from './menu/menu.module';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routing';

import { Service } from './service/service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    DashboardModule,
    LoginModule,
    MenuModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [environment.ENV_PROVIDERS, Service],
  bootstrap: [AppComponent]
})
export class AppModule {
}
