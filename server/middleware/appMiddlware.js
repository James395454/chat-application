var morgan = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
// setup global middleware here

module.exports = function(app) {
  app.use(express.static('./server/views'));
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};
