function mainPageCode (username){
var socket = io.connect();
var $messageForm = $('#messageForm');
var $message = $('#message');
var $chat = $('#chat');
var $messageArea = $('#messageArea');
var $users = $('#users');
var $welcome = $('#welcome');
var $chatter = $('#chatter');
console.log('username: '+username);
const msgURL = "http://localhost:3000/message/send";
const usersURL = "http://localhost:3000/users/";
const messageURL = "http://localhost:3000/message/";
var sendTO;
$welcome.css('color','green');
$welcome.css('font-size', '40px');
$welcome.text('Welcome ' + username + '!!!');
$chatter.css('color','blue');
$chatter.css('margin','0 0 0 200px');
socket.emit('username',{username: username }, function(err , data){
  var users = [];
  $.ajax({
       type: "GET",
       url: usersURL + username,
       success: function(res) {
         users = res;
         for (var i=0;i<users.length;i++){
           const username = users[i].username;
           const style = statusStyle(users[i]);
           var color = style.color, status = style.status;
           $users.append('<div><div class = "well" style="display:inline-block; width:50%"><a id="userLink' + (i+1) + '" href="#" ><strong><center>'+username+'</center></strong></a></div>'
           + '<div class = "well" id="' + username +'" style="display:inline-block; width:50%;" ><strong style="color: ' + color + '"><center>'+ status +'</center></strong></div></div>');
         }
         sendTO = users[0].username;
         $message.attr("placeholder", "Type a message to " + sendTO + " or select another user in the list...");
         console.log(res);
         loadChat(username, sendTO);
         events();
       },
       error: function(err) {
         console.log(err.responseText);
       }
  });

  $messageForm.submit(function(e){
  e.preventDefault();
  const message = $message.val();
  $.ajax({
       type: "POST",
       url: msgURL,
       data: {message: message, recipient: sendTO, username: username},
       success: function(res) {
         $chat.append('<div class = "well"><strong style="color:green">'+username+'</strong>:' + message + '<div>');
         $chat.scrollTop($chat[0].scrollHeight);
         console.log(res);
       },
       error: function(err) {
         console.log(err.responseText);
       }
  });
  $message.val('');
  });

  function events(){
    for(var i = 0; i < users.length; i++) {
      const id = '#userLink' + (i+1);

      $(id).on('click',function() {
        $(chat).empty();
        const communicator = $(this).text();
        sendTO = communicator;
        $message.attr("placeholder", "Type a message to " + sendTO + " or select another user in the list...");
        console.log(communicator);
        loadChat(username, communicator);
      });
    }

    socket.on('new message', function(req){
      console.log('received message: ' + req.message);
      if(req.username == username){
        if(sendTO == req.sender){
          console.log(req);
          $chat.append('<div class = "well"><strong style="color:red">'+req.sender+'</strong>:' + req.message + '<div>');
          $chat.scrollTop($chat[0].scrollHeight);
        }
      }
    });
    socket.on('update users status', function(req){
      console.log('refreshing user status');
      const style = statusStyle(req);
      var color = style.color, status = style.status;
      $('#'+req.username).html('<strong style="color:' + color + '" ><center>' + status + '</center></strong>' );
    });
  }
});
function loadChat(username, communicator){
  $.ajax({
       type: "GET",
       url: messageURL + username + '/' + communicator,
       success: function(res) {
         const messages = res;
         var chatFriend, color;
         for (var i=0;i<messages.length;i++){
           if(messages[i].type == 'sent'){
             chatFriend = username;
             color = 'green';
           }else{
             chatFriend = communicator;
             color = 'red';
           }
           $chat.append('<div class = "well" id="message"><strong style="color: ' + color + '">'+chatFriend+'</strong>:' + messages[i].message + '<div>');
           $chatter.text('Chatting with: ' + communicator);
           $chat.scrollTop($chat[0].scrollHeight);
         }
         console.log(res);
       },
       error: function(err) {
         console.log(err.responseText);
       }
  });
}
}
function statusStyle(user){
  if(user.online){
    color = 'green';
    status = 'Online';
  }else{
    color = 'red';
    status = 'Offline';
  }
  return {color: color, status: status};
}
