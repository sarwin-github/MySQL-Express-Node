const session = require('express-session');
const mysql   = require('mysql')
const async   = require('async')

const PRODUCTION_DB = 'books';
const TEST_DB = 'books-test';

const MODE_TEST = 'test';
const MODE_PRODUCTION = 'dev';

const state = {
  pool: null,
  mode: null,
}

const connect = function(mode, done) {
	state.pool = mysql.createPool({
	    connectionLimit : 100,
	    host     : 'localhost',
	    port     : '9080',
	    user     : 'root',
	    password : '01610715',
	    database : 'books',
	    debug    :  false
	})

	state.mode = mode
	done()
}

module.exports.get = function() {
  return state.pool
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	switch (env) {
	    case 'dev':
	        connect(this.MODE_PRODUCTION, function(err) {
				if (err) {
			    	console.log('Unable to connect to MySQL.')
			    	process.exit(1);
				} else {
					console.log('Connected to MySQL.')
			    	app.set('port', process.env.PORT || 9001);
			  	}
			})
	    break;
	};

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: false, 
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

