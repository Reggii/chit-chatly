import '../alertifyjs/alertify.js'

const roomName = JSON.parse(document.getElementById('room-name').textContent);
const userName = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  ?.split("=")[1];
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

setTimeout(function() {
const message = userName + ' has joined the room'
chatSocket.send(JSON.stringify({
    'message': message
})); }, 1000);


chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    document.querySelector('#chat-log').value += (data.message + '\n');
};


chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};


document.querySelector('#chat-message-submit').onclick = function(e) {
    const timeStamp = new Date().toLocaleTimeString();
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = `(${timeStamp}) ${userName}: ${messageInputDom.value}`;
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
    document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight
};


document.querySelector('#log-out').onclick = function(e) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    $.ajax({
        url: '/api/log_out_user/',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
        },
        success: function() {
            window.location.href = `http://127.0.0.1:8000/`
        },
        error: function() {
            return alertify.alert('Unable to complete operation', 'You are already logged out')
        }
    });
};


document.querySelector('#change-room').onclick = function(e) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    alertify.prompt('Change room', 'Enter the room you want to join', function(evt, value) {
    const alertifyHeader = document.querySelector('.ajs-header')
    const alertifyCommands = document.querySelector('.ajs-close')
    if (value.length < 3 || value.length > 12) {
            alertify.alert('Invalid room name', 'Room name can be between 3 and 10 characters long')
            alertifyCommands.style.display = 'none'
            alertifyHeader.style.padding = '0px'
            alertifyHeader.style.margin = '0px'
            alertifyHeader.style.backgroundColor = '#1e1e1e'
            alertifyHeader.style.color = '#1e1e1e'
            return
        } 
    else {  
    $.ajax({
        url: '/chat/room=' + value + '/',
        method: 'POST',
        data: JSON.stringify(userName),
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
        },
        success: function(data) {
            console.log(`Connected to room ${value}`)
            document.cookie = `username=${userName}`
            window.location.href = `/chat/room=${value}`
        },
        error: function(data) {
            console.log(data);
            alertify.alert('Error', 'Username or password incorrect')
        }
    }); }
    });
};
 
const roomHeader = document.querySelector('#room_name')
roomHeader.innerHTML = roomHeader.innerHTML + roomName

const roomTitle = document.querySelector('title')
roomTitle.innerHTML = roomTitle.innerHTML + roomName

