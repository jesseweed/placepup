'use strict';

const client      = require('./client.js'),
      path        = require('path'),
      rootPath    = path.normalize(__dirname + '/../'),
      buildRoot   = path.normalize(rootPath + '/_dist/'),
      configRoot  = path.normalize(__dirname),
      publicRoot  = path.normalize(rootPath + '/public/'),
      serverRoot  = path.normalize(rootPath + '/server/'),
      shared      = require('./shared.js');

let config = {

  // NAME OF APPLICATION
  name: shared.name,

  // CACHE
  cache: false,

  // CORS
  cors: false,

  db: false,

  favicon: path.resolve(__dirname, '../public/favicon.png'),

  // GZIP
  gzip: true,

  namespace: shared.namespace,

  // PORT TO RUN ON
  port: shared.port,

  // PRETTIFY OUTPUT
  prettify: shared.prettify,

  // SECURITY
  security: {
    digest: 'sha512',
    length: 512,
    iterations: 10000,
    secret: '!01234567890^0987654321!'
  },

  session: {
    use: true,
    name: 'app',
    httpOnly: false,
    secure: false,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    // REDIS
    driver: {
      type: 'redis',
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    }
  },

  socket: shared.socket

};


// PASSPORT SETTINGS
config.auth = {
  passport: {
    use: false,
    strategy: null
  }
};

// DIRECTORY MAPPING
config.dir = {
  build: {
  },
  client: {
    root: rootPath + '/client/'
  },
  config: {
    environment: configRoot + '/environment/',
    passport: configRoot + '/passport/',
    server: configRoot + '/server',
    webpack: configRoot + '/webpack',
    root: configRoot
  },
  public: {},
  root: rootPath,
  server: {
    controllers: serverRoot + 'controllers/',
    models: serverRoot + 'shared/models/',
    root: serverRoot,
    router: rootPath + 'shared/lib/router.js',
    routes: serverRoot + 'routes/',
    script: 'server.js',
    socket: serverRoot + 'socket',
    views: {
      engine: shared.engines.html,
      dir: [publicRoot, buildRoot, serverRoot + 'views/']
    }
  }
};

// SET NODE_ENV
if (typeof process.env.NODE_ENV === 'undefined') process.env.NODE_ENV === 'development';

// SET DOMAIN
if (process.env.NODE_ENV === 'development') {
  config.domain = require('ip').address();
} else {
  config.domain = shared.domains[process.env.NODE_ENV];
}

// SET BASE URL
config.address = `//${config.domain}/`;

// SET PUBLIC DIRECTORIES
config.dir.public = {
  css: config.address + 'css/',
  img: config.address + 'img/',
  io: config.address + 'socket.io/socket.io.js',
  lib: config.address + 'lib/',
  js: config.address + 'js/'
};

config.client = client;

// EXPORT ALL THE THINGS
module.exports = config;
