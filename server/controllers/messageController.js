var User = require('../models/userModel');
var _ = require('lodash');
var path = require('path');
const mainPagePath = path.join(__dirname, '../views', 'mainPage.html');
var arr = require('../../initiate');
exports.send = function(req, res, next) {

  var newMessage = req.body.message;
  var communicator = req.body.recipient;
  var sender = req.body.username;
  console.log('request to: ' + communicator);
  var element;
  for(var i=0;i<arr.connectedUsers.length;i++){
    if (arr.connectedUsers[i].username == communicator){
      element = arr.connectedUsers[i];
      break;
    }
  }
  console.log(arr.connectedUsers);
  if(element){
    var socket = element.socket;
    console.log('found ' + element.username);
    socket.emit('new message', { username: communicator, message: newMessage, sender:sender });
    console.log('emitted');
  }
  User.findOne({username: new RegExp('^'+sender+'$', "i")})
    .then(function(user) {
      if (!user){
        next('user not found');
      }
      user.messages.push({message: newMessage, type: 'sent', communicator: communicator});
      console.log('message pushed');
      user.save(function (err) {
        if (err) next('couldnt save new message');
      });
    }, function(err) {
      console.log(err);
      next('error sending message');
    });

  User.findOne({username: new RegExp('^'+communicator+'$', "i")})
    .then(function(user) {
      user.messages.push({message: newMessage, type: 'received', communicator: sender});
      console.log('message pushed');
      user.save(function (err) {
        if (err) next('couldnt save new message');
        res.send('success');
      });
    }, function(err) {
      console.log(err);
      next('error sending message');
    });
};

exports.get = function(req, res, next) {
  console.log('reqss ' + req.params.communicator);
  const communicator = req.params.communicator;
  const username = req.params.username;
  console.log('username :' + username);
  User.findOne({username: username})
    .then(function(user) {
      if (user){
        const messages = user.messages;
        var selectedMessages = [];
        for (var i=0;i<messages.length;i++){
          console.log(messages[i].communicator);
          if (messages[i].communicator == communicator){
            selectedMessages.push(messages[i]);
          }
        }
        res.send(selectedMessages);
    }else{
      next('user no longer exists');
      }
    }, function(err) {
      console.log(err);
      next(err);
    });
};
