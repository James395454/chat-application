var express = require('express');
var app = express();
var config = require('./config/config');
var authRouter = require('./routes/authRoutes');
var messageRouter = require('./routes/messageRoutes');
var userRouter = require('./routes/userRoutes');

require('mongoose').connect(config.db.url);

// setup the app middlware
require('./middleware/appMiddlware')(app);
app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/users', userRouter);


module.exports = app;
