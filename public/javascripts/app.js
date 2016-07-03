var socket = io();
socket.emit('start message', 'hi');

socket.on("username", function(username) {
    $("#username").text("your user name is " + username)
})
