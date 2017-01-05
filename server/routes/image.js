'use strict';

module.exports = function(app) {

  // RENDER ALL PAGES TO APP VIEW
  app.get('/:width/:height/:color?', function (req, res) {

    const fs = require('fs'),
          Jimp = require('jimp'),
          path = require('path');

    let w     = Number(req.params.width),
        h     = Number(req.params.height),
        root  = path.normalize(__dirname + '/../../'),
        dir   = `${root}public/img/pups/`,
        files = fs.readdirSync(dir);

    processImage(getFile());

    function getFile() {
      return dir + files[Math.floor(Math.random() * files.length)];
    }

    function processImage(img) {
      Jimp.read(img, function (err, image) {

        if (err) {
          processImage(getFile());
        } else {
          image.cover(w, h).quality(60);
          if (req.params.color === 'g') image.greyscale();
          image.getBuffer('image/png', sendImage);
        }

      });
    }

    // SEND IMAGE TO BROWSER
    function sendImage(err, img) {
      if (!err) {
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        res.end(img);
      }
    }

  });

};
