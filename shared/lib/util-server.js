'use strict';

const moment        = require('moment'),
      Winston       = require('winston'),
      chalk         = require('chalk'),

      // PRIMARY LOGGER
      logger        = new (Winston.Logger)({
        transports: [

          // CONSOLE
          new (Winston.transports.Console)({
            timestamp: function() {
              return moment();
            },
            formatter: function(options) {
              let level = options.level;
              let levelColor = 'cyan';
              if (level === 'debug') levelColor = 'green';
              else if (level === 'info') levelColor = 'blue';
              else if (level === 'error') levelColor = 'red';
              else if (level === 'warn') levelColor = 'yellow';
              else if (level === 'silly') levelColor = 'magenta';
              return chalk.gray(options.timestamp()) + ' ' + chalk[levelColor](level.toUpperCase()) + ': ' + (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            },
            level: 'debug'
          }),

          // LOG TO FILE FOR ERROR AND ABOVE
          new (Winston.transports.File)({
            filename: '_logs/error.log',
            level: 'warn'
          })

        ]
      });

// PUSH APPLICATION ERRORS TO SLACK IN PROD & SIM ENV
if (process.env.NODE_ENV === 'production') {
}

module.exports = {

  logger: {
    error: function() {
      if (arguments.length === 1) {
        logger.log('error', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('error', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('error', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('error', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('error', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('error', arguments);
      }
    },
    info: function() {
      if (arguments.length === 1) {
        logger.log('info', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('info', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('info', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('info', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('info', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('info', arguments);
      }
    },
    log: function() {
      if (arguments.length === 1) {
        logger.log('debug', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('debug', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('debug', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('debug', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('debug', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('debug', arguments);
      }
    },
    silly: function() {
      if (arguments.length === 1) {
        logger.log('silly', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('silly', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('silly', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('silly', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('silly', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('silly', arguments);
      }
    },
    verbose: function() {
      if (arguments.length === 1) {
        logger.log('verbose', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('verbose', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('verbose', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('verbose', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('verbose', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('verbose', arguments);
      }
    },
    warn: function() {
      if (arguments.length === 1) {
        logger.log('warn', arguments[0]);
      } else if (arguments.length === 2) {
        logger.log('warn', arguments[0], arguments[1]);
      } else if (arguments.length === 3) {
        logger.log('warn', arguments[0], arguments[1], arguments[2]);
      } else if (arguments.length === 4) {
        logger.log('warn', arguments[0], arguments[1], arguments[2], arguments[3]);
      } else if (arguments.length === 5) {
        logger.log('warn', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      } else {
        logger.log('warn', arguments);
      }
    }
  },

  // APPLY TITLE CASING
  titleCase: function(str) {
    var newstr = str.split(' ');
    for (let i = 0; i < newstr.length; i++) {
      let copy = newstr[i].substring(1).toLowerCase();
      newstr[i] = newstr[i][0].toUpperCase() + copy;
    }
    return newstr.join(' ');
  }

};
