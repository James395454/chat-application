function mainPageCode (username){
var socket = io.connect();
var $messageForm = $('#messageForm');
var $message = $('#message');
var $chat = $('#chat');
var $messageArea = $('#messageArea');
var $users = $('#users');
var $welcome = $('#welcome');
var $chatter = $('#chatter');
const msgURL = "http://localhost:3000/message/send";
const usersURL = "http://localhost:3000/users/";
const messageURL = "http://localhost:3000/message/";
var usersCount = 0;
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
           $users.append('<div><div class = "well" style="display:inline-block; width:50%"><a id="userLink' + (usersCount++) +'" href="#" ><strong><center>'+username+'</center></strong></a></div>'
           + '<div class = "well" id="' + username +'" style="display:inline-block; width:50%;" ><strong style="color: ' + color + '"><center>'+ status +'</center></strong></div></div>');
         }
         if(users[0]){
           sendTO = users[0].username;
           $message.attr("placeholder", "Type a message to " + sendTO + " or select another user in the list...");
           $chatter.text('Chatting with: ' + sendTO);
         }else{
           $message.attr("placeholder", "No other users have signed up to the application");
         }
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
    if(sendTO){
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
    }
  });
  function events(){
    for(var i = 0; i < users.length; i++) {
      const id = '#userLink' + i;
      updateEventHandler(id);
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
    socket.on('new user', function(req, fn){
      console.log('got new user');
      const user = req;
      const style = statusStyle(user), color = style.color, status = style.status;
      if(!sendTO){
        sendTO = req.username;
        $message.attr("placeholder", "Type a message to " + sendTO + " or select another user in the list...");
      }
      $chatter.text('Chatting with: ' + sendTO);
      $users.append('<div><div class = "well" style="display:inline-block; width:50%"><a id="userLink' + (usersCount) + '" href="#" ><strong><center>'+req.username+'</center></strong></a></div>'
      + '<div class = "well" id="' + req.username +'" style="display:inline-block; width:50%;" ><strong style="color: ' + color + '"><center>'+ status +'</center></strong></div></div>');
      updateEventHandler('#userLink'+usersCount++);
      fn('done');
    });
    function updateEventHandler(id){
      console.log('id: ' + id);
      $(id).on('click',function() {
        $(chat).empty();
        const communicator = $(this).text();
        sendTO = communicator;
        $message.attr("placeholder", "Type a message to " + sendTO + " or select another user in the list...");
        console.log(communicator);
        loadChat(username, communicator);
        return false;
      });
    }
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
