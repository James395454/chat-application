const baseURL = "http://localhost:3000/auth/";
$('#login-form').submit(function(ev) {
    ev.preventDefault();
    const req = $(document.activeElement).attr('id');
    console.log('val ' + req);
    const username = $('#username').val(), password = $('#password').val();
    if(!(/\s/.test(username))) {
      $.ajax({
           type: "POST",
           url: req == 'login' ? baseURL + 'login': baseURL + 'signup',
           data: {username: username, password: password},
           success: function(res) {
             if(req=='login'){
               $('html').html(res);
               console.log('1: ' + username);
               mainPageCode(username);
             }else{
               $('#result').text(res);
             }
           },
           error: function(err) {
             console.log(err.responseText);
             $('#result').text(err.responseText);
           }
      });
    }else{
      $('#result').text('user name should not contain any spaces!');
    }
});
