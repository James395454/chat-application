var express = require('express');
var app = express();
var config = require('./config/config');
var authRouter = require('./routes/authRoutes');

require('mongoose').connect(config.db.url);

// setup the app middlware
require('./middleware/appMiddlware')(app);
app.use('/auth', authRouter);

module.exports = app;
