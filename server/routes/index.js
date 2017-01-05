'use strict';

module.exports = function(app) {

  // RENDER ALL PAGES TO APP VIEW
  app.get('/', function (req, res) {

    // IF WE'RE LOGGED IN
    if (req.session && typeof req.session.passport !== 'undefined' && req.session.passport.user !== '') {
      let user = req.session.passport.user;
      app.set('userData', user);

      res.render('index', {
        config: app.get('config')
      });

    // IF NOT LOGGED IN
    } else {
      res.render('index', {
        config: app.get('config')
      });
    }
  });

};
