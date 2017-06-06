var config = require('./server/config/config');
var app = require('./server/server');
var request = require ('request');

app.listen(config.port);
console.log('listening on http://localhost:' + config.port);
