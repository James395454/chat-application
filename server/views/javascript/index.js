const baseURL = "http://localhost:3000/auth/"
$('#login-form').submit(function(ev) {
    ev.preventDefault();
    console.log('val ' + $(document.activeElement).attr('id'));
    const requestURL = $(document.activeElement).attr('id') == 'login' ? baseURL + 'login': baseURL + 'signup';
    $('#login-form').attr('action', requestURL);
    this.submit();
});
