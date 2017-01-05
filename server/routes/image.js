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

        let q = 60;
        let text = false;
        let type = 'image/png';

        if (req.query.quality) q = Number(req.query.quality); type = 'image/jpeg';
        if (req.query.q) q = Number(req.query.q); type = 'image/jpeg';

        if (req.query.text) text = req.query.text;
        if (req.query.msg) text = req.query.msg;

        if (err) {
          console.error('error processing image', err);
          processImage(getFile());
        } else {
          image.cover(w, h).quality(q);
          if (req.params.color === 'g') image.greyscale();

          if (text) {
            let font = Jimp.FONT_SANS_128_BLACK;

            let x = 10;
            let y = 10;

            if (w < 1000) font = Jimp.FONT_SANS_64_WHITE;
            if (w < 500) font = Jimp.FONT_SANS_32_WHITE;
            if (w < 300) font = Jimp.FONT_SANS_16_WHITE;
            if (w < 100) font = Jimp.FONT_SANS_8_WHITE;

            Jimp.loadFont(font).then(function (font) {
              image.print(font, x, y, text, w);
              image.getBuffer(type, function(err, img) {
                sendImage(err, img, type);
              });
            });
          } else {
            image.getBuffer(type, function(err, img) {
              sendImage(err, img, type);
            });
          }
        }

      });
    }

    // SEND IMAGE TO BROWSER
    function sendImage(err, img, type) {
      if (!err) {
        res.writeHead(200, {
          'Content-Type': type,
          'Content-Length': img.length
        });
        res.end(img);
      }
    }

  });

};
