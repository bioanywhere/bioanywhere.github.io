import utils from './utils.js'

let CLIENT_ID = "200624216191-nujs4nugdo4171450bfmm55rk5fksdej.apps.googleusercontent.com"
let REDIRECT_URI = "https://bioanywhere.github.io/profile.html"
let SCOPES = "https://www.googleapis.com/auth/userinfo.profile"

let button = document.getElementById('button')

button.addEventListener('click',signIn)

function signIn(){

utils.signIn(CLIENT_ID,REDIRECT_URI,SCOPES)

}