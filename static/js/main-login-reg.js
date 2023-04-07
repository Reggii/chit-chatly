// This file is used to display and hide the login and regist forms

// Buttons
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')
const connectButton = document.getElementById('connect_login')
const backButton = document.getElementById('back_login')
const regconfirmButton = document.getElementById('register_conf')
const backregButton = document.getElementById('back_reg')

// Fields
const usernameField = document.getElementById('username')
const passwordField = document.getElementById('password')
const roomnameField = document.getElementById('room')
const usernameregField = document.getElementById('username_reg')
const passwordregField = document.getElementById('password_reg')


function loginForm () {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    displayLoginForm()
}

function displayLoginForm () {
    usernameField.style.display = 'initial'
    passwordField.style.display = 'initial'
    roomnameField.style.display = 'initial'
    connectButton.style.display = 'initial'
    backButton.style.display = 'initial'
}

function registerForm () {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    displayRegForm()
}

function displayRegForm () {
    usernameregField.style.display = 'initial'
    passwordregField.style.display = 'initial'
    backregButton.style.display = 'initial'
    regconfirmButton.style.display = 'initial'
}

function backToMain () {
    usernameField.style.display = 'none'
    passwordField.style.display = 'none'
    roomnameField.style.display = 'none'
    connectButton.style.display = 'none'
    usernameregField.style.display = 'none'
    passwordregField.style.display = 'none'
    backregButton.style.display = 'none'
    regconfirmButton.style.display = 'none'
    backButton.style.display = 'none'
    loginButton.style.display = 'initial';
    registerButton.style.display = 'initial';
}

loginButton.addEventListener('click', loginForm)

backButton.addEventListener('click', backToMain)

registerButton.addEventListener('click', registerForm)

backregButton.addEventListener('click', backToMain)

$(document).keypress(function(e){
    if (e.which == 13){
        if (regconfirmButton.style.display == 'initial') {
            $("#register_conf").click();
        }
        else if (connectButton.style.display == 'initial') {
            $("#connect_login").click();
        }
    }
});