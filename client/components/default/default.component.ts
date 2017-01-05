// APP CONFIG
let config = require('../../../config/client');

// ANGULAR MODULES
import { Component } from '@angular/core';
import { Logger } from 'angular2-logger/core';

@Component({
  selector: config.namespace,
  templateUrl: 'default.component.pug',
  styleUrls: ['default.component.scss']
})

export class DefaultComponent {

  loaded: boolean = false;

  constructor (
    private logger: Logger
  ){}

  ngOnInit() {
    this.loaded = true;
  }

}
