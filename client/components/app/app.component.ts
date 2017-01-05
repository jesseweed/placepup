// APP CONFIG
let config = require('../../../config/client');

// ANGULAR MODULES
import { Component } from '@angular/core';
import { Logger } from 'angular2-logger/core';

@Component({
  selector: config.namespace,
  templateUrl: 'app.component.pug',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  constructor (
    private logger: Logger
  ){}

  ngOnInit() {}

}
