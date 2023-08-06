import '../alertifyjs/alertify.js'

let onlineUsers = []
const roomName = JSON.parse(document.getElementById('room-name').textContent);
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const userName = document.cookie
console.log(userName)
  .split("; ")
  .find((row) => row.startsWith("username="))
  ?.split("=")[1];
  
const chatSocket = new WebSocket(
    'wss://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);


setTimeout(function() { // Display joined room message in chat text box
const message = userName + ' has joined the room'
chatSocket.send(JSON.stringify({
    'message': message
}))}, 1000);


setTimeout(function() { // Display online users 
    display_online()
        setTimeout(function() { // Get online users from json file and display in users box
        chatSocket.send(JSON.stringify({
            'message': onlineUsers }))
        }, 500); 
}, 500);

chatSocket.onmessage = function(e) {
    const _data = JSON.parse(e.data);
    if (Array.isArray(_data.message)) {
        document.querySelector('#user-log').value = '';
        for (const user of _data.message[0]) {
            document.querySelector('#user-log').value += (user + '\n');
        }
    }
    else {
        document.querySelector('#chat-log').value += (_data.message + '\n');
    }
};


chatSocket.addEventListener('close', function (event) {
    chatSocket.send(JSON.stringify({
        'message': userName + ' has left the room' 
    }))
    alertify.alert('Connection closed', 'You have been disconnected from the server').set(
        'onok', function(closeEvent){ 
            const sendData = {
                'username': userName,
                'room': roomName,
                'type': 'leave_room'
            }
            change_room(sendData)
        })
});


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
    chatSocket.send(JSON.stringify({
        'message': userName + ' has left the room' 
    }))
    const sendData ={
        'username': userName,
        'room': roomName
    }
    $.ajax({
        url: '/api/log_out_user/',
        method: 'POST',
        data: JSON.stringify(sendData),
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
        },
        success: function() {
            window.location.href = "/"
        },
        error: function() {
            alertify.alert('Unable to complete operation', 'You are already logged out')
            alertify.addEventListener('onok', function() {
                window.location.href = "/"
            })
        }
    });
};


document.querySelector('#change-room').onclick = function(e) {

    alertify.prompt('Change room', 'Enter the room you want to join', function(evt, newRoom) {
    const alertifyHeader = document.querySelector('.ajs-header')
    const alertifyCommands = document.querySelector('.ajs-close')
    if (newRoom.length < 3 || newRoom.length > 12) {
            alertify.alert('Invalid room name', 'Room name can be between 3 and 10 characters long')
            alertifyCommands.style.display = 'none'
            alertifyHeader.style.padding = '0px'
            alertifyHeader.style.margin = '0px'
            alertifyHeader.style.backgroundColor = '#1e1e1e'
            alertifyHeader.style.color = '#1e1e1e'
            return
        } 
    else {  
    const sendData ={
        'username': userName,
        'room': roomName,
        'new_room': newRoom,
        'type': 'change_room',
        }
    change_room(sendData)
        }
    });
};


function change_room(sendData) {
    $.ajax({
    url: '/api/change_room/',
    method: 'POST',
    data: JSON.stringify(sendData),
    headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrftoken
    },
    success: function(data) {
        chatSocket.send(JSON.stringify({
            'message': userName + ' has left the room' 
        }))
        if (data.response == 'changing room') {
            display_online()
            document.cookie = `username=${userName}`
            window.location.href = `/chat/room=${sendData.new_room}`
             }
        else if (data.response == 'deleted user') {
            window.location.href = "/"
            }
    },
    error: function(data) {
        console.log(data);
    }
    })}


function display_online() {
        const json_file_name = '/static/js/roomUsers.json';
        fetch(json_file_name)
        .then(response => {
            response.json()
            console.log(response)
        })
        .then(json_data => {
            console.log(json_data)
            for (const room of json_data) {

                if (room.roomname === roomName) {
                    onlineUsers.push(room.users)
                }
            }})
}
    
const roomHeader = document.querySelector('#room_name')
roomHeader.innerHTML = roomHeader.innerHTML + roomName

const roomTitle = document.querySelector('title')
roomTitle.innerHTML = roomTitle.innerHTML + roomName

