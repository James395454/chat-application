var User = require('../models/userModel');
var _ = require('lodash');
var path = require('path');
var socketClient = require('socket.io-client');
const mainPagePath = path.join(__dirname, '../views', 'mainPage.html');

exports.create = function(req, res, next) {
  console.log('request: ' + req.body.username);
  var newUser = req.body;
  User.create(newUser)
    .then(function(user) {
      res.send('signup complete!');
    }, function(err) {
      console.log(err);
      next('username already exists');
    });
};

exports.get = function(req, res, next) {
  User.findOne(req.body)
    .then(function(user) {
      if (user){
        res.sendFile(mainPagePath);
    }else{
      next('username or password incorrect');
      }
    }, function(err) {
      console.log(err);
      next(err);
    });
};

exports.delete = function(req, res, next) {
  req.body.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
exports.connectedUsers = function(){
  return connectedUsers;
}
