var User = require('../models/userModel');
var _ = require('lodash');
var path = require('path');
const mainPagePath = path.join(__dirname, '../views', 'mainPage.html');
var arr = require('../../initiate');

exports.get = function(req, res, next) {
  var username = req.params.username;
  var resUser = [];
  User.find({})
    .then(function(users) {
      for(var i=0;i<users.length;i++){
        if (users[i].username != username){
          if(isConnected(users[i].username)){
            resUser.push({username: users[i].username, online:true});
          }else {
            resUser.push({username: users[i].username, online:false});
          }
        }
      }
        res.send(resUser);
    }, function(err) {
      console.log(err);
      next(err);
    });
};

function isConnected(username){
  for(var i=0;i<arr.connectedUsers.length;i++){
    if (arr.connectedUsers[i].username == username){
      return true;
    }
  }
  return false;
}
