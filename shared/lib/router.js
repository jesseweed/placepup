'use strict';

module.exports = function(app, config) {

  const fs = require('fs'),
        routes = fs.readdirSync(config.dir.server.routes);

  // REQUIRE ALL ROUTES IN /ROUTES DIR
  for (var i = 0; i < routes.length; i++) {
    if (routes[i] !== 'error.js' && routes[i] !== 'index.js' && routes[i] !== '.DS_Store' && routes[i] !== '.gitkeep') {
      console.log('load route', app.get('routes') + routes[i]);
      require(app.get('routes') + routes[i])(app);
    }
  }

  // LOAD INDEX & ERROR ROUTES LAST
  require(app.get('routes') + 'index')(app);
  require(app.get('routes') + 'error')(app);

  // DEFAULT ERROR HANDLER IF NOTHING ELSE INTERCEPTS
  app.use(function(err, req, res, next) {
    console.error('An application error has occurred:', err);
    res.render('errors/500', {
      config: app.get('config'),
      error: {
        code: 500,
        title: 'Server Error!',
        message: err
      }
    });
  });

};
