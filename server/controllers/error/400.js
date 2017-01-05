'use strict';

module.exports = function(app, client) {

  require('../../lib/util').logger.error('Unknown error, throw 400 page');

  client.send.render('errors/500', {
    config: app.get('config'),
    client: client.get.session.passport.user, // Local session maintained in passport
    error: {
      code: 500,
      title: 'Server Error!',
      message: 'An an unkown error has occurred. Please try again'
    }
  });
};
