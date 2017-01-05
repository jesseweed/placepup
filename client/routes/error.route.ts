import { Routes } from '@angular/router';
import { error404Component } from '../components/error/error404.component';

export const ErrorRoute: Routes = [
  {
    path: '**',
    component: error404Component
  }
];
