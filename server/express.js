'use strict';

module.exports =  function(app) {

  const bodyParser    = require('body-parser'), // ENABLE FORM DATA,
        config        = require('../config/server.js'),
        express       = require('express'),
        flash         = require('connect-flash'),
        multer        = require('multer'), // ENABLE MULTI-PART FORM UPLOADS
        path          = require('path'),
        rootPath      = path.normalize(__dirname + '/../..'),
        webpack       = require('webpack'),
        webpackConfig = require(config.dir.config.webpack),
        util          = require('../shared/lib/util-server'),
        logger        = util.logger;

  console.log('WEBPACK CONFIG', config.dir.config.webpack);
  const compiler      = webpack(webpackConfig);

  // SAVE CONFIG AS GLOBAL APP VARIABLE
  app.set('config', config);

  var sassMiddleware = require('node-sass-middleware');
  app.use(sassMiddleware({
    /* Options */
    src: './public/styles',
    dest: './public',
    debug: true,
    outputStyle: 'compressed'
  }));

  // SET PUBLIC DIR
  app.use('/', express.static('./public'));
  app.use('/', express.static('./_dist'));
  app.use(express.static(rootPath, {index: false}));

  // SAVE SOME SETTING TO APP CONFIG FOR EASY ACCESS LATER
  app.set('controllers', config.dir.server.controllers);
  app.set('routes', config.dir.server.routes);
  app.set('views', config.dir.server.views.dir);
  app.set('view engine', config.dir.server.views.engine);
  app.set('case sensitive routing', false);
  app.set('security', config.security);
  app.set('upload', multer()); // ENABLE MULTI-PART FORMS
  app.use(bodyParser.json()); // ENABLE application/json
  app.use(bodyParser.urlencoded({ extended: false })); // ENABLE application/x-www-form-urlencoded
  app.locals.pretty = config.prettify;
  app.use(flash());

  // CONFIG BASED SETTINGS
  if (config.cors) app.use(require('cors')()); // ENABLE CORS
  if (config.gzip) app.use(require('compression')()); // ENABLE GZIP

  // CONNECT TO DB
  if (config.db.url) {
    const db = require(config.db.type);
    db.connect(config.db.url);
    app.set('db', db);
    app.set('Models', {
      // desk: mongoose.model('MyModel', mongoose.Schema(require(config.dir.server.models + 'schemas/MyModel')))
    });
  }

  // ADD SOCKET
  if (config.socket) {
    let Socket = require(config.dir.server.socket);
    app.socket = new Socket(app);
  }

  // REDIS SESSION
  if (config.session.use && config.session.driver.type === 'redis') {

    const session               = require('express-session'), // ENABLE SESSIONS
          redis                 = require('redis'),
          RedisStore            = require('connect-redis')(session),
          uuid                  = require('uuid');

    app.use(session({
      cookie: {
        httpOnly: config.session.httpOnly,
        secret: config.security.secret,
        secure: config.session.secure
      },
      genid: function(req) {
        return uuid.v4(); // use UUIDs for session IDs
      },
      name: config.session.name,
      resave: config.session.resave,
      rolling: config.session.rolling,
      saveUninitialized: config.session.saveUninitialized,
      secret: config.security.secret,
      store: new RedisStore({
        client: redis.createClient(config.session.driver.url)
      })
    }));
  }


  // PASSPORT
  if (config.auth.passport.use) {
    const passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(config.auth.passport.strategy, require('./passport/' + config.auth.passport.strategy)(app));
    app.set('passport', passport);
  }

  if (process.env.NODE_ENV !== 'production') {

    // WEBPACK
    let webpackDevMiddlewareInstance = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true
      }
    });

    app.use(webpackDevMiddlewareInstance);

    webpackDevMiddlewareInstance.waitUntilValid(function() {
      console.log('\n\n');
      logger.info('##################    ######################');
      logger.info('# SERVER STARTED #    ######################');
      logger.info('##################    ######################');
      logger.info(`DOMAIN:               http:${config.address}`);
      logger.info(`ENVIRONMENT:          ${process.env.NODE_ENV}`);
      logger.info(`NAMESPACE:            ${config.namespace}`);
      logger.info(`SOCKET.IO ENABLED:    ${config.socket}`);
      logger.info(`CLIENT FRAMEWORK:     ${config.client.framework}`);
      if (config.session.use) logger.info(`SESSION:              ${config.session.driver.type}`);
      logger.info('##################    ######################');
      console.log('\n\n');
    });

    // HMR
    app.use(require('webpack-hot-middleware')(compiler, {
      log: logger.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    }));
  }



  /*  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! DANGER : DO NOT MODIFY BELOW THIS LINE  !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !  */

  // - - - - - - - - - - - - - - - - - - - - - -
  // CAPTURES REQ & RES FOR CONTROLLER USE LATER
  // - - - - - - - - - - - - - - - - - - - - - -
  app.use('*', function (req, res, next) {
    app.set('req', req);
    app.set('res', res);
    next();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // METHOD TO LOAD A CONTROLLER FROM A ROUTE
  // const controller = app.get('controller')();
  // controller.get('product');
  // - - - - - - - - - - - - - - - - - - - - - - - -
  app.set('controller', function() {
    return {
      get: function(which) {
        require(config.dir.server.controllers + which)(app, {
          get: app.get('req'),
          send: app.get('res')
        });
      }
    };
  });

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // METHOD TO LOAD A MODEL FROM A CONTROLLER
  // const Model = app.get('model')('user');
  // Model.get('entry type', id).then(function(data)
  // - - - - - - - - - - - - - - - - - - - - - - - -
  app.set('model', function(which, id) {
    return require(config.dir.server.models + which)(app, id);
  });

  // LOAD OUR ROUTER
  require(config.dir.server.router)(app, config);

};
