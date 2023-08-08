import '../alertifyjs/alertify.js'

// Capture all the inputs from the form
let usernameInput = document.getElementById('username_reg')
let passwordInput = document.getElementById('password_reg')
let registerButton = document.querySelector('#register_conf')
passwordInput.type = 'password'


// Validate the username and password lengths
registerButton.addEventListener('click', function() {
    let userDetails = {
        'username': usernameInput.value,
        'password': passwordInput.value
    }
    if (userDetails.username.length < 4 || userDetails.username.length > 10) {
        return alertify.alert('Invalid username', 'Username must be between 4 and 10 characters long')
    } 
    if (userDetails.password.length < 8 || userDetails.password.length > 15) {
        return alertify.alert('Invalid password', 'Password must be between 8 and 15 characters long')
    }
    else {
        registerUser(userDetails)
    }
});

// Send the data to the backend for registration
// If the username already exists, return an error
function registerUser(userDetails) {

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        url: '/api/register_user/',
        method: 'POST',
        data: JSON.stringify(userDetails),
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
        },
        success: function(data) {
            console.log(data);
            alertify.alert('Success', 'You have registered successfully')
            setTimeout(function() {
            window.location.href = '/'} , 1500);
        },
        error: function(data) {
            if (data.error == 'Invalid request') {
                alertify.alert('Error', 'Ther was an issue with your request')
            }
            if (data.error == 'Username already exists') {
                alertify.alert('Error', 'Username already exists')
            }
            console.log(data);
        }
    });
}
