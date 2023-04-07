import '../alertifyjs/alertify.js'

// Get username, password and room inputs from the form
// Get the csrf token
// Get the connect button
// Set the password input type to password
let usernameInput = document.getElementById('username')
let passwordInput = document.getElementById('password')
let roomInput = document.getElementById('room')
let connectButton = document.querySelector('#connect_login')
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
passwordInput.type = 'password'

// Add event listener to the connect button
// Get the values of the username, password and room inputs
// Check if the username is between 4 and 10 characters long
// If it is, call the loginUser function
// If it isn't, display an alert
connectButton.addEventListener('click', function() {
    let userDetails = {
        'username': usernameInput.value,
        'password': passwordInput.value,
        'room': roomInput.value
    }
    if (userDetails.username.length < 4 || userDetails.username.length > 10) {
        return alertify.alert('Invalid username', 'Username must be between 4 and 10 characters long')
    } 
    if (userDetails.room.length < 3 || userDetails.room.length > 12) {
        return alertify.alert('Invalid room name', 'Room name can be between 3 and 10 characters long')
    } 
    else {
        loginUser(userDetails)
    }
});

// Function to login the user
// Make an ajax request to the login_user api
// If the request is successful, display an alert and call connectToRoom function
// If the request is not successful, display an alert
function loginUser(userDetails) {
        
        $.ajax({
            url: '/api/login_user/',
            method: 'POST',
            data: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                document.cookie = `username=${userDetails.username}`
                window.location.href = `/chat/room=${userDetails.room}`
            },
            error: function(data) {
                alertify.alert('Error', 'Username or password incorrect')
            }
        });
}

