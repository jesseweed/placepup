'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // SET DEFAULT ENVIRONMENT

// Define our constants
const express  = require('express'),
      app      = express(),
      util     = require(__dirname + '/shared/lib/util-server'),
      logger   = util.logger;

// EXPRESS SETTINGS
require(__dirname + '/server/express')(app);

let config = app.get('config');

process.env.PORT = process.env.PORT || config.port;

// START THE APP BY LISTENING ON <PORT>
app.server = app.listen(process.env.PORT, function(err) {

  if (err) { // IF THERE'S ANY ERROR
    logger.error('Server error: ', err);
  } else {

    if (process.env.NODE_ENV === 'production') {
      logger.info('##################    ######################');
      logger.info('# SERVER STARTED #    ######################');
      logger.info('##################    ######################');
    }

    if (config.socket) app.socket.connect();
  }
});
