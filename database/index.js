'use strict';

let config 		= require('../config/index');
let Mongoose 	= require('mongoose');

let dbURI = "mongodb://" +
			encodeURIComponent(config.db.username) + ":" + 
			encodeURIComponent(config.db.password) + "@" + 
			config.db.host + ":" + 
			config.db.port + "/" + 
			config.db.name;
Mongoose.connect(dbURI, console.log('Success!'));


Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});


Mongoose.Promise = global.Promise;
