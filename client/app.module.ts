// ANGULAR MODULES
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { RouterModule, Routes } from '@angular/router';

// THIRD-PARTY
import { Logger } from 'angular2-logger/core';

// COMPONENTS
import { AppComponent } from './components/app/app.component';
import { DefaultComponent } from './components/default/default.component';
import { error404Component } from './components/error/error404.component';

// ROUTING
import { routing, appRoutingProviders } from './app.routing.module';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    AppComponent,
    DefaultComponent,
    error404Component
  ],
  providers: [
    appRoutingProviders,
    Logger
  ],
  bootstrap: [
    AppComponent
  ]
})


export class AppModule {

  constructor(
    public  appRef: ApplicationRef,
    private logger: Logger
  ) {
    // ENABLE LOGGING
    logger.level = logger.Level.LOG;
  }

  // HOT MODULE RELOAD
  hmrOnInit(store) {}

  hmrOnDestroy(store) {
    this.logger.info('Files changed, updating browser...');
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    store.disposeOldHosts = createNewHosts(cmpLocation); // recreate elements
    removeNgStyles(); // remove styles
  }

  hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
