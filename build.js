console.log('Initating production build.');

var build = require('webpack-build'),
    path  = require('path');

process.env.NODE_ENV = 'production';

build({
  config: path.join(__dirname, './config/build.js'),
  watch: false
}, function(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log('Build complete.');
    process.exit();
  }
});
