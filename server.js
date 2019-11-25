'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__base = __dirname + '/';

// Include config
var config = require('./src/config/env'),
app = require('./src/config/express');

// Create server
app.listen(config.port, () => {
  
  console.log('Server listening on port '+config.port+'!');
});