// LIBS
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// IMPORT ROUTES
import { DefaultRoute }    from './routes/default.route';
import { ErrorRoute }    from './routes/error.route';

// DEFINE ROUTES
const appRoutes: Routes = [
  ...DefaultRoute,
  ...ErrorRoute
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
