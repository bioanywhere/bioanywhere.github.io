import utils from './utils.js'

let CLIENT_ID = "200624216191-nujs4nugdo4171450bfmm55rk5fksdej.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file";

let button = document.getElementById('button')

button.addEventListener('click',signIn)

function signIn(){

utils.signIn(CLIENT_ID,REDIRECT_URI,SCOPES)

}



let button = document.getElementById('logout') // Get the logout button from the profile.html file

button.addEventListener('click',logout)

function logout(){

utils.logout(CLIENT_ID,REDIRECT_URI)

}
