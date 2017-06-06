var User = require('../models/userModel');
var _ = require('lodash');
var path = require('path');
const mainPagePath = path.join(__dirname, '../views', 'mainPage.html');
exports.create = function(req, res, next) {
  console.log('request: ' + req.body.username);
  var newUser = req.body;
  User.create(newUser)
    .then(function(user) {
      res.body = user;
      res.sendFile(mainPagePath);
    }, function(err) {
      console.log(err);
      next(err);
    });
};

exports.get = function(req, res, next) {
  User.findOne(req.body)
    .then(function(user) {
      if (user){
      res.body = user;
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
