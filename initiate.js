var config = require('./server/config/config');
var app = require('./server/server');
var socket = require('socket.io');
var connectedUsers = [];
var server = app.listen(config.port);

var io = socket.listen(server);
console.log('listening on http://localhost:' + config.port);

io.sockets.on('connection', function(socket){
  socket.on('username', function(data,fn){
    var username = data.username;
    var user = updateUser(username, socket);
    refreshUsersStatus(username, true);
    console.log('user: ' + user.username);
     console.log(connectedUsers);
     socket.on('disconnect',function(data){
       console.log('disconnecting ' + connectedUsers.indexOf(user));
       if(connectedUsers.indexOf(user) != -1){
         connectedUsers.splice(connectedUsers.indexOf(user),1);
         refreshUsersStatus(username, false);
       }
     });
     fn('done');
    });
 });

 function updateUser(username, socket){
   for(var i=0;i<connectedUsers.length;i++){
     if (connectedUsers[i].username == username){
       connectedUsers[i].socket = socket;
       return connectedUsers[i];
     }
   }
   const user = {socket: socket, username: username};
   connectedUsers.push(user);
   return user;
 }
 function refreshUsersStatus(username, isOnline){
   for(var i=0;i<connectedUsers.length;i++){
     if (connectedUsers[i].username != username){
       connectedUsers[i].socket.emit('update users status',{username:username, online: isOnline});
     }
   }
 }
exports.connectedUsers = connectedUsers;
