'use strict';

let session 	= require('express-session');
let MongoStore	= require('connect-mongo')(session);
let db = require('../database');
let config 		= require('../config/config');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
var init = function() {
  if (process.env.NODE_ENV === 'production') {
    return session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({ mongooseConnection: db.Mongoose.connection }),
    });
  } else {
    return session({
      secret: config.sessionSecret,
      resave: false,
      unset: 'destroy',
      saveUninitialized: true,
    });
  }
};

module.exports = init();
