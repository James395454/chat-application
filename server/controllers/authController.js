var User = require('../models/userModel');
var _ = require('lodash');
var path = require('path');
var socketClient = require('socket.io-client');
var async = require('async');
const mainPagePath = path.join(__dirname, '../views', 'mainPage.html');
var arr = require('../../initiate');

exports.create = function(req, res, next) {
  console.log('request: ' + req.body.username);
  var newUser = req.body;
  User.create(newUser)
    .then(function(user) {
      console.log(arr.connectedUsers);
      async.eachOf(arr.connectedUsers, (user, i, eachOfasyncCallback) =>{
        console.log('at index: ' + i);
        if(user.username != req.body.username){
          console.log('emitting to ' + user.username);
          user.socket.emit('new user',{username:req.body.username, online: false},function(err,data){
            console.log('done');
            return eachOfasyncCallback();
          });
        }else{
          return eachOfasyncCallback();
        }
      }, (err) => {
        if (!err){
          console.log('signup complete!');
          return res.send('signup complete!');
        }else{
          console.log(err);
          return next(err);
        }
      });
    }, function(err) {
      console.log(err);
      return next('username already exists');
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
