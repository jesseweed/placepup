// APP CONFIG
let config = require('../../../config/client');

// ANGULAR MODULES
import { Component, ViewEncapsulation } from '@angular/core';
import { Logger } from 'angular2-logger/core';

@Component({
  selector: config.namespace,
  templateUrl: 'error404.component.pug',
  styleUrls: ['error404.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class error404Component {

  constructor (
    private logger: Logger
  ){}

  ngOnInit() {
    this.logger.log('404 page');
  }

}
