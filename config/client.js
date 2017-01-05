'use strict';

const shared = require('./shared.js');

module.exports = {

  // BASIC

  name: shared.name,

  namespace: shared.namespace,

  // ADVANCED

  dir: {
    app: 'client/app',
    assets: {
      img: 'public/img'
    },
    components: 'client/app/components',
    root: 'client',
    routes: 'client/routes',
    services: 'client/services',
    shared: 'client/shared'
  },

  engine: shared.engines,

  framework: 'angular',

  prettify: shared.prettify,

  socket: shared.socket

};
