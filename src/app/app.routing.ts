import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dash.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  // {
  //   path: 'sw',
  //   component: ServiceWorkerComponent
  // },
  // {
  //   path: '**',
  //   component: NotFoundComponent
  // }
];
